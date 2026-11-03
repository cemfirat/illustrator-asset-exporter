#target illustrator
/*
  ILLUSTRATOR ASSET EXPORTER - macOS / Adobe Illustrator (ExtendScript ES3)

  RULES
  - Artboard names starting with '_' (underscore) or '*': PDF ONLY.
    All marked artboards go into ONE multipage PDF, in artboard order.
  - All other artboards: iOS PNG 1x/2x/3x; Android PNG at five densities;
    Web SVG and PNG 1x/2x; optional Web JPG 1x/2x.
  - Optional external conversion tools can create WebP and Xcode assets.
  - Output filenames match original artboard names (case, spaces, accents).
    Exception: Android resource filenames have stricter rules. Only Android
    filenames are normalized, and every change appears in the report.
  - NO "ui_" prefix, NO artboard numbers, NO unwanted SVG suffixes.
  - PDF is saved using a temporary copy; the source .ai is not overwritten.
  - Illustrator runtime compatibility must be validated on your installation.

  Run: File > Scripts > Other Script...
  Adobe Illustrator itself is needed to run this file.
*/
(function () {
    if (app.documents.length === 0) {
        alert("Open an Illustrator document first.");
        return;
    }
    var doc = app.activeDocument;
    if (doc.artboards.length === 0) {
        alert("The document has no artboards.");
        return;
    }

    function pad2(n) { return n < 10 ? "0" + n : String(n); }
    function timestamp(d) {
        return d.getFullYear() + pad2(d.getMonth() + 1) + pad2(d.getDate()) + "_" +
            pad2(d.getHours()) + pad2(d.getMinutes()) + pad2(d.getSeconds());
    }
    function stem(name) { return String(name).replace(/\.[^.]+$/, ""); }
    function isPDFMarker(name) {
        // '_' is the main convention. '*' is recognized as well if it was meant literally.
        return name.charAt(0) === "_" || name.charAt(0) === "*";
    }
    function invalidMacName(s) {
        return s.length < 1 || s.length > 170 || /^\s*$/.test(s) ||
            /[\/\\:\x00-\x1f\x7f]/.test(s) || /[. ]$/.test(s) ||
            s === "." || s === "..";
    }
    function androidResourceName(s) {
        // Android drawable resource names must be lowercase ASCII identifiers.
        // This normalization affects ONLY Android outputs.
        var n = String(s).toLowerCase();
        n = n.replace(/\u00e4/g, "ae").replace(/\u00f6/g, "oe").replace(/\u00fc/g, "ue");
        n = n.replace(/\u00df/g, "ss").replace(/\u00e9|\u00e8|\u00ea/g, "e");
        n = n.replace(/\u00e0|\u00e1|\u00e2/g, "a").replace(/\u00f1/g, "n");
        n = n.replace(/[^a-z0-9_]+/g, "_").replace(/_+/g, "_").replace(/^_+|_+$/g, "");
        if (!/^[a-z]/.test(n)) n = "asset_" + n;
        return n;
    }
    function makeFolder(parent, name) {
        var f = new Folder(parent.fsName + "/" + name);
        if (!f.exists && !f.create()) throw new Error("Could not create folder: " + f.fsName);
        return f;
    }
    function outputFile(folder, base, extension) {
        return new File(folder.fsName + "/" + base + "." + extension);
    }
    function verifyCreated(f, description) {
        if (!f.exists) throw new Error("Export file not created (" + description + "): " + f.fsName);
    }
    function listSvgs(folder) {
        var found = [], files = folder.getFiles(), i;
        for (i = 0; i < files.length; i++) {
            if (files[i] instanceof File && /\.svg$/i.test(files[i].name)) found.push(files[i]);
        }
        return found;
    }
    function deleteTempSvgs(folder) {
        var fs = folder.getFiles(), i;
        for (i = 0; i < fs.length; i++) {
            if (fs[i] instanceof File) fs[i].remove();
        }
    }

    var pdfInitialName = stem(doc.name);
    if (!pdfInitialName) pdfInitialName = "Combined_PDF";

    // ------------------------------------------------------------------
    // SETTINGS / GUI
    // ------------------------------------------------------------------
    var dlg = new Window("dialog", "Illustrator Asset Exporter | iOS + Android + Web + PDF");
    dlg.orientation = "column";
    dlg.alignChildren = "fill";
    var headline = dlg.add("statictext", undefined,
        "_Cover, _Guide etc. => ONE multi-page PDF; other artboards => app/web.");
    headline.alignment = "left";

    var targets = dlg.add("panel", undefined, "Standard artboard exports");
    targets.orientation = "column";
    targets.alignChildren = "left";
    var optIOS = targets.add("checkbox", undefined, "iOS / iPadOS: PNG 1x, @2x, @3x");
    var optAndroid = targets.add("checkbox", undefined, "Android: PNG mdpi, hdpi, xhdpi, xxhdpi, xxxhdpi");
    var optWeb = targets.add("checkbox", undefined, "Web: SVG + PNG 1x and @2x");
    var optJPG = targets.add("checkbox", undefined, "Optional: Web JPEG quality 85 (1x, @2x; no transparency)");
    optIOS.value = true;
    optAndroid.value = true;
    optWeb.value = true;
    optJPG.value = false;

    var pdfPanel = dlg.add("panel", undefined, "Special rule: PDF-only artboards");
    pdfPanel.orientation = "column";
    pdfPanel.alignChildren = "left";
    var optPDF = pdfPanel.add("checkbox", undefined,
        "Artboards starting with '_' or '*' => ONE PDF only");
    optPDF.value = true;
    var pdfNameGroup = pdfPanel.add("group");
    pdfNameGroup.add("statictext", undefined, "Combined PDF filename:");
    var pdfNameInput = pdfNameGroup.add("edittext", undefined, pdfInitialName);
    pdfNameInput.characters = 32;

    var misc = dlg.add("panel", undefined, "Additional settings");
    misc.orientation = "column";
    misc.alignChildren = "left";
    var onlyActive = misc.add("checkbox", undefined, "Only process the active artboard");
    var transparent = misc.add("checkbox", undefined, "Export PNGs with a transparent background");
    onlyActive.value = false;
    transparent.value = true;

    var explanation = dlg.add("statictext", undefined,
        "Output filenames match artboard names; Android resource names may be normalized.");
    explanation.alignment = "left";

    var btns = dlg.add("group");
    btns.alignment = "right";
    btns.add("button", undefined, "Cancel", {name: "cancel"});
    btns.add("button", undefined, "Export...", {name: "ok"});
    if (dlg.show() !== 1) return;

    // ------------------------------------------------------------------
    // PREFLIGHT: fail early instead of silently renaming/overwriting files.
    // ------------------------------------------------------------------
    var originalActive = doc.artboards.getActiveArtboardIndex();
    var selected = [], assets = [], pdfBoards = [], i;
    if (onlyActive.value) selected.push(originalActive);
    else for (i = 0; i < doc.artboards.length; i++) selected.push(i);

    for (i = 0; i < selected.length; i++) {
        var ix = selected[i];
        var name = String(doc.artboards[ix].name);
        if (isPDFMarker(name)) pdfBoards.push({index: ix, name: name});
        else assets.push({index: ix, name: name, android: androidResourceName(name)});
    }
    var anyRaster = optIOS.value || optAndroid.value || optWeb.value || optJPG.value;
    if ((!anyRaster || assets.length === 0) && (!optPDF.value || pdfBoards.length === 0)) {
        alert("No matching artboards or output formats are selected.");
        return;
    }

    var warnings = [], errors = [], manifest = [], completed = 0;
    var nameSeen = {}, androidSeen = {}, generatedSeen = {}, problems = [];
    function reserveOutput(path, artboardName) {
        var key = "#" + path.toLowerCase();
        if (generatedSeen[key]) {
            problems.push("Filename collision: '" + generatedSeen[key] + "' and '" +
                artboardName + "' would both write '" + path + "'.");
        } else generatedSeen[key] = artboardName;
    }
    if (anyRaster) {
        for (i = 0; i < assets.length; i++) {
            var a = assets[i];
            if (invalidMacName(a.name)) {
                problems.push("Invalid or overly long filename: '" + a.name + "' (artboard " + (a.index + 1) + ")");
                continue;
            }
            var folded = a.name.toLowerCase();
            if (nameSeen["#" + folded]) {
                problems.push("Duplicate artboard name: '" + a.name + "'. Rename the artboards uniquely.");
            }
            nameSeen["#" + folded] = true;
            // Check generated @2x/@3x variants, not just source artboard names.
            // Example: "Logo" and "Logo@2x" must never overwrite one another.
            if (optIOS.value) {
                reserveOutput("iOS/PNG/" + a.name + ".png", a.name);
                reserveOutput("iOS/PNG/" + a.name + "@2x.png", a.name);
                reserveOutput("iOS/PNG/" + a.name + "@3x.png", a.name);
            }
            if (optWeb.value) {
                reserveOutput("Web/PNG/" + a.name + ".png", a.name);
                reserveOutput("Web/PNG/" + a.name + "@2x.png", a.name);
                reserveOutput("Web/SVG/" + a.name + ".svg", a.name);
            }
            if (optJPG.value) {
                reserveOutput("Web/JPG/" + a.name + ".jpg", a.name);
                reserveOutput("Web/JPG/" + a.name + "@2x.jpg", a.name);
            }
            if (optAndroid.value) {
                if (androidSeen["#" + a.android]) {
                    problems.push("Android resource name collision: '" + a.name + "' and '" +
                        androidSeen["#" + a.android] + "' -> '" + a.android + "'.");
                }
                androidSeen["#" + a.android] = a.name;
                if (a.android !== a.name) warnings.push("Android: '" + a.name + "' -> '" + a.android + "'");
            }
        }
    }
    var pdfBase = String(pdfNameInput.text).replace(/\.pdf$/i, "");
    if (optPDF.value && pdfBoards.length && invalidMacName(pdfBase)) {
        problems.push("Enter a valid filename for the combined PDF.");
    }

    var aiSource = null;
    if (optPDF.value && pdfBoards.length) {
        try { aiSource = doc.fullName; } catch (noFile) { aiSource = null; }
        if (!aiSource || !aiSource.exists || !/\.ai$/i.test(aiSource.name) || !doc.saved) {
            problems.push("PDF safety check: Save the latest document as an .ai file first " +
                "(File > Save), then rerun the script. " +
                "A temporary copy is required to create the PDF safely.");
        }
    }
    if (problems.length) {
        alert("Export canceled. Fix these issues first:\n\n- " + problems.join("\n- "));
        return;
    }
    if (doc.documentColorSpace === DocumentColorSpace.CMYK && anyRaster && assets.length) {
        if (!confirm("This document uses CMYK. RGB/sRGB is recommended for screen assets. Continue anyway?")) return;
    }

    var destination = Folder.selectDialog("Choose the export destination");
    if (!destination) return;
    var runBase = "Illustrator_Export_" + timestamp(new Date());
    var folderOut = new Folder(destination.fsName + "/" + runBase), n = 2;
    while (folderOut.exists) {
        folderOut = new Folder(destination.fsName + "/" + runBase + "_" + n);
        n++;
    }
    if (!folderOut.create()) {
        alert("Could not create the output folder.");
        return;
    }

    function fail(kind, id, e) { errors.push(kind + " | " + id + " | " + String(e)); }
    function track(file, annotation) {
        completed++;
        manifest.push(annotation + " => " + file.fsName);
    }
    function exportPNG(folder, name, scalePct, annotation) {
        var o = new ExportOptionsPNG24();
        o.artBoardClipping = true;
        o.antiAliasing = true;
        o.transparency = transparent.value;
        o.matte = !transparent.value;
        o.horizontalScale = scalePct;
        o.verticalScale = scalePct;
        doc.exportFile(new File(folder.fsName + "/" + name), ExportType.PNG24, o);
        var out = outputFile(folder, name, "png");
        verifyCreated(out, "PNG");
        track(out, annotation + " (" + scalePct + "%)");
    }
    function exportJPG(folder, name, scalePct, annotation) {
        var o = new ExportOptionsJPEG();
        o.artBoardClipping = true;
        o.antiAliasing = true;
        o.matte = true;
        o.optimization = true;
        o.qualitySetting = 85;
        o.horizontalScale = scalePct;
        o.verticalScale = scalePct;
        doc.exportFile(new File(folder.fsName + "/" + name), ExportType.JPEG, o);
        var out = outputFile(folder, name, "jpg");
        verifyCreated(out, "JPG");
        track(out, annotation + " (" + scalePct + "%)");
    }
    function exportSVG(svgFolder, tempFolder, artboardIndex, name) {
        // Export to a dedicated temporary directory. Adobe may append a suffix
        // to an SVG filename when saveMultipleArtboards is true. We then COPY
        // the sole generated SVG to precisely <artboard-name>.svg.
        deleteTempSvgs(tempFolder);
        var o = new ExportOptionsSVG();
        o.saveMultipleArtboards = true;
        o.artboardRange = String(artboardIndex + 1); // Illustrator 1-based artboard selection
        o.compressed = false;
        o.coordinatePrecision = 4;
        o.embedRasterImages = true;
        o.preserveEditability = false;
        o.cssProperties = SVGCSSPropertyLocation.STYLEATTRIBUTES;
        doc.exportFile(new File(tempFolder.fsName + "/__current_svg"), ExportType.SVG, o);
        var generated = listSvgs(tempFolder);
        if (generated.length !== 1) {
            throw new Error("SVG export produced " + generated.length +
                " files instead of one. Check SVG artboard-range behavior in your Illustrator version.");
        }
        var out = outputFile(svgFolder, name, "svg");
        if (out.exists) throw new Error("SVG would overwrite an existing file: " + out.fsName);
        if (!generated[0].copy(out)) throw new Error("Could not copy SVG to the original artboard filename.");
        verifyCreated(out, "SVG");
        track(out, "Web/SVG");
        deleteTempSvgs(tempFolder);
    }
    function exportCombinedPDF(pdfFolder, pdfName, boards, source) {
        // Crucial: Never call saveAs(PDF) on the user's open original document.
        // Use an on-disk .ai COPY, open it, save THAT document as PDF, close it.
        // This requires the source .ai to be saved/current (validated above).
        var copyFile = new File(folderOut.fsName + "/__temp_pdf_copy.ai");
        var clone = null;
        var pdfOut = outputFile(pdfFolder, pdfName, "pdf");
        if (!source.copy(copyFile)) throw new Error("Could not create the temporary PDF copy.");
        try {
            clone = app.open(copyFile);
            var o = new PDFSaveOptions();
            var pageRange = [], p;
            for (p = 0; p < boards.length; p++) pageRange.push(String(boards[p].index + 1));
            o.artboardRange = pageRange.join(",");
            o.compatibility = PDFCompatibility.ACROBAT7;
            o.preserveEditability = false;
            o.generateThumbnails = false;
            o.viewAfterSaving = false;
            clone.saveAs(pdfOut, o);
            verifyCreated(pdfOut, "PDF");
            track(pdfOut, "PDF / " + boards.length + " artboard(s): " + pageRange.join(","));
        } finally {
            try { if (clone) clone.close(SaveOptions.DONOTSAVECHANGES); } catch (closeError) {
                fail("PDF cleanup", "close temporary copy", closeError);
            }
            try { if (copyFile.exists && !copyFile.remove()) {
                warnings.push("Please remove the temporary copy manually: " + copyFile.fsName);
            } } catch (cleanError) {
                warnings.push("Could not remove the temporary PDF copy: " + copyFile.fsName);
            }
            try { doc.activate(); } catch (activationError) {}
        }
    }

    // ------------------------------------------------------------------
    // EXECUTION
    // ------------------------------------------------------------------
    var tmpSVG = null;
    try {
        var ios = optIOS.value && assets.length ? makeFolder(folderOut, "iOS") : null;
        var iosPNG = ios ? makeFolder(ios, "PNG") : null;
        var android = optAndroid.value && assets.length ? makeFolder(folderOut, "Android") : null;
        var web = (optWeb.value || optJPG.value) && assets.length ? makeFolder(folderOut, "Web") : null;
        var webPNG = optWeb.value && assets.length ? makeFolder(web, "PNG") : null;
        var webSVG = optWeb.value && assets.length ? makeFolder(web, "SVG") : null;
        var webJPG = optJPG.value && assets.length ? makeFolder(web, "JPG") : null;
        if (webSVG) tmpSVG = makeFolder(webSVG, "__temp_svg");
        var pdfFolder = optPDF.value && pdfBoards.length ? makeFolder(folderOut, "PDF") : null;

        var dpi = [
            {name: "drawable-mdpi", pct: 100},
            {name: "drawable-hdpi", pct: 150},
            {name: "drawable-xhdpi", pct: 200},
            {name: "drawable-xxhdpi", pct: 300},
            {name: "drawable-xxxhdpi", pct: 400}
        ];
        var androidFolders = [], d;
        if (android) {
            for (d = 0; d < dpi.length; d++) {
                androidFolders.push(makeFolder(android, dpi[d].name));
            }
        }

        for (i = 0; i < assets.length; i++) {
            var item = assets[i];
            doc.artboards.setActiveArtboardIndex(item.index);
            if (iosPNG) {
                try { exportPNG(iosPNG, item.name, 100, "iOS/PNG 1x"); } catch (e1) { fail("iOS PNG", item.name, e1); }
                try { exportPNG(iosPNG, item.name + "@2x", 200, "iOS/PNG 2x"); } catch (e2) { fail("iOS PNG", item.name + "@2x", e2); }
                try { exportPNG(iosPNG, item.name + "@3x", 300, "iOS/PNG 3x"); } catch (e3) { fail("iOS PNG", item.name + "@3x", e3); }
            }
            if (android) {
                for (d = 0; d < dpi.length; d++) {
                    try {
                        exportPNG(androidFolders[d], item.android, dpi[d].pct,
                            "Android/" + dpi[d].name);
                    } catch (ead) {
                        fail("Android/" + dpi[d].name, item.name, ead);
                    }
                }
            }
            if (webPNG) {
                try { exportPNG(webPNG, item.name, 100, "Web/PNG 1x"); } catch (e4) { fail("Web PNG", item.name, e4); }
                try { exportPNG(webPNG, item.name + "@2x", 200, "Web/PNG 2x"); } catch (e5) { fail("Web PNG", item.name + "@2x", e5); }
                try { exportSVG(webSVG, tmpSVG, item.index, item.name); } catch (esvg) { fail("Web SVG", item.name, esvg); }
            }
            if (webJPG) {
                try { exportJPG(webJPG, item.name, 100, "Web/JPG 1x"); } catch (e6) { fail("Web JPG", item.name, e6); }
                try { exportJPG(webJPG, item.name + "@2x", 200, "Web/JPG 2x"); } catch (e7) { fail("Web JPG", item.name + "@2x", e7); }
            }
        }
        if (pdfFolder) {
            try { exportCombinedPDF(pdfFolder, pdfBase, pdfBoards, aiSource); }
            catch (epdf) { fail("Combined PDF", pdfBase, epdf); }
        }
    } catch (fatal) {
        fail("General export", doc.name, fatal);
    } finally {
        if (tmpSVG) {
            try { deleteTempSvgs(tmpSVG); tmpSVG.remove(); } catch (cleanSVGError) {
                warnings.push("Please remove the temporary SVG folder manually: " + tmpSVG.fsName);
            }
        }
        try { doc.activate(); } catch (activateError) {}
        try { doc.artboards.setActiveArtboardIndex(originalActive); } catch (restoreError) {
            fail("Restore", "active artboard", restoreError);
        }
    }

    // Always write a report even if one part of export failed.
    try {
        var report = new File(folderOut.fsName + "/ExportReport.txt");
        report.encoding = "UTF-8";
        if (!report.open("w")) throw new Error("Could not open ExportReport.txt for writing.");
        {
            report.writeln("Illustrator Asset Exporter - Export report");
            report.writeln("Source document: " + doc.name);
            report.writeln("Artboards processed: " + selected.length);
            report.writeln("Standard artboards: " + assets.length);
            report.writeln("PDF-only artboards: " + pdfBoards.length + " (start with '_' or '*')");
            report.writeln("Output files created: " + completed);
            report.writeln("Errors: " + errors.length + " | Warnings: " + warnings.length);
            report.writeln("PDF: All marked artboards are combined into ONE PDF, not PNG/SVG.");
            report.writeln("Names: unchanged for iOS/Web; Android only normalized when required.");
            report.writeln("Color: inherited from Illustrator document; RGB/sRGB is recommended for web.");
            report.writeln("");
            report.writeln("PDF pages (artboard order):");
            for (i = 0; i < pdfBoards.length; i++) {
                report.writeln("  " + (pdfBoards[i].index + 1) + ": " + pdfBoards[i].name);
            }
            report.writeln("");
            report.writeln("FILES:");
            for (i = 0; i < manifest.length; i++) report.writeln("  " + manifest[i]);
            if (warnings.length) {
                report.writeln("");
                report.writeln("WARNINGS:");
                for (i = 0; i < warnings.length; i++) report.writeln("  " + warnings[i]);
            }
            if (errors.length) {
                report.writeln("");
                report.writeln("ERRORS:");
                for (i = 0; i < errors.length; i++) report.writeln("  " + errors[i]);
            }
            report.close();
        }
    } catch (reportErr) {
        errors.push("Could not write export report: " + String(reportErr));
    }

    alert("Export finished.\n" + completed + " files created | " + errors.length +
        " errors | " + warnings.length + " warnings.\n\n" +
        "Output: " + folderOut.fsName + "\n\n" +
        "Details: ExportReport.txt.\nThe source document was not overwritten by the PDF export.");
})();
