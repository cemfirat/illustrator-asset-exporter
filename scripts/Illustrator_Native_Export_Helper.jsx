#target illustrator
/*
  Illustrator Native Export Helper - MIT - Copyright (c) 2026 Cem Firat
  Prepare ranges for the native Export for Screens dialog and export only
  '_' / literal '*' artboards into one PDF. No asset exports or renaming.
  This does NOT set the native dialog's Range or import/apply a preset.
  Preview: test in your installed Illustrator version before production use.
*/
(function () {
    function partition(artboards) {
        var result = {assets: [], pdf: [], labels: []}, i, name;
        for (i = 0; i < artboards.length; i++) {
            name = String(artboards[i].name);
            if (name.charAt(0) === '_' || name.charAt(0) === '*') {
                result.pdf.push(i + 1);
                result.labels.push((i + 1) + ': ' + name);
            } else result.assets.push(i + 1);
        }
        return result;
    }
    function rangeText(numbers) {
        var parts = [], i = 0, start, end;
        while (i < numbers.length) {
            start = numbers[i]; end = start;
            while (i + 1 < numbers.length && numbers[i + 1] === end + 1) {
                i++; end = numbers[i];
            }
            parts.push(start === end ? String(start) : start + '-' + end);
            i++;
        }
        return parts.join(',');
    }
    function sourceFile(doc) {
        var source = null;
        try { source = doc.fullName; } catch (e) {}
        if (!doc.saved || !source || !source.exists || !/\.ai$/i.test(source.name)) {
            throw new Error('Save the latest document as a local .ai file first, then try again.');
        }
        return source;
    }
    function exportMarkedPDF(doc, target) {
        var plan = partition(doc.artboards);
        // An empty PDF range means ALL artboards in Illustrator: never pass it.
        if (!plan.pdf.length) throw new Error('No marked artboards. Nothing was exported.');
        var source = sourceFile(doc);
        if (!/\.pdf$/i.test(target.name)) throw new Error('The output must end in .pdf.');
        if (target.exists) throw new Error('This PDF already exists. Choose another filename.');
        var token = String(new Date().getTime()) + '_' + Math.floor(Math.random() * 1000000);
        // Keep the copy next to the source so relative linked-image paths still resolve.
        var temp = new File(source.parent.fsName + '/__IAE_PDF_COPY_' + token + '.ai');
        var attempt = 0;
        while (temp.exists) {
            attempt++;
            if (attempt > 100) throw new Error('Could not allocate a temporary copy.');
            temp = new File(source.parent.fsName + '/__IAE_PDF_COPY_' + token + '_' + attempt + '.ai');
        }
        var clone = null, copied = false, warnings = [], failure = null;
        try {
            copied = source.copy(temp.fsName);
            if (!copied) throw new Error('Cannot create a temporary .ai copy beside the source. Check folder permissions.');
            clone = app.open(temp);
            if (clone === doc) {
                clone = null;
                throw new Error('Safety check: Illustrator did not open a separate copy.');
            }
            if (!clone || clone.artboards.length !== doc.artboards.length) {
                throw new Error('The copied document does not match the source artboards.');
            }
            var i;
            for (i = 0; i < doc.artboards.length; i++) {
                if (String(clone.artboards[i].name) !== String(doc.artboards[i].name)) {
                    throw new Error('Artboard names changed when opening the copy. Export stopped.');
                }
            }
            if (target.exists) throw new Error('The PDF now exists. Export stopped to avoid overwriting it.');
            var options = new PDFSaveOptions();
            options.artboardRange = plan.pdf.join(',');
            options.compatibility = PDFCompatibility.ACROBAT7;
            options.preserveEditability = false;
            options.generateThumbnails = false;
            options.viewAfterSaving = false;
            clone.saveAs(target, options);
            if (!target.exists || target.length === 0) throw new Error('Illustrator did not create a non-empty PDF.');
        } catch (e) {
            failure = e;
        } finally {
            var closed = true;
            if (clone) {
                try { clone.close(SaveOptions.DONOTSAVECHANGES); }
                catch (closeError) { closed = false; warnings.push('Close the temporary document manually.'); }
            }
            if (copied && temp.exists && closed) {
                try {
                    if (!temp.remove()) warnings.push('Remove temporary copy: ' + temp.fsName);
                } catch (removeError) { warnings.push('Remove temporary copy: ' + temp.fsName); }
            } else if (copied && temp.exists) warnings.push('Temporary copy retained: ' + temp.fsName);
            try { doc.activate(); } catch (activateError) { warnings.push('Switch back to the original document manually.'); }
        }
        if (failure) {
            throw new Error(String(failure) + '\nAny partially written PDF must be inspected before use.' +
                (warnings.length ? '\n' + warnings.join('\n') : ''));
        }
        return {pages: plan.pdf.length, warnings: warnings};
    }
    // TEST_HOOK: unit tests expose the pure functions and mocked PDF operation here.
    if (!app.documents.length) { alert('Open an Illustrator document first.'); return; }
    var doc = app.activeDocument, plan = partition(doc.artboards);
    var dialog = new Window('dialog', 'Native export helper | marked pages to PDF');
    dialog.orientation = 'column'; dialog.alignChildren = 'fill';
    dialog.add('statictext', undefined, 'Native assets: ' + plan.assets.length + ' | PDF-only pages: ' + plan.pdf.length);
    dialog.add('statictext', undefined, 'Copy this into Export for Screens > Artboards > Range:');
    var assetsField = dialog.add('edittext', undefined, rangeText(plan.assets), {readonly: true});
    assetsField.characters = 55;
    if (!plan.assets.length) dialog.add('statictext', undefined, 'No regular assets. Skip the native asset export; do NOT use Select All.');
    dialog.add('statictext', undefined, 'Marked PDF artboards (also usable with the native PDF Only preset):');
    var pdfField = dialog.add('edittext', undefined, rangeText(plan.pdf), {readonly: true});
    pdfField.characters = 55;
    var labels = dialog.add('edittext', undefined, plan.labels.join('\n'), {multiline: true, readonly: true});
    labels.preferredSize = [520, 110];
    dialog.add('statictext', undefined, 'Select range text and press Cmd+C. This helper does not set the native selection.');
    var group = dialog.add('group'); group.alignment = 'right';
    var exportButton = group.add('button', undefined, 'Export marked PDF...');
    exportButton.enabled = plan.pdf.length > 0;
    group.add('button', undefined, 'Close', {name: 'cancel'});
    exportButton.onClick = function () {
        try {
            var source = sourceFile(doc);
            var suggested = new File(source.parent.fsName + '/' + source.name.replace(/\.ai$/i, '') + '.pdf');
            var target = suggested.saveDlg('Save ONE PDF for the marked artboards', '*.pdf');
            if (!target) return;
            if (!/\.pdf$/i.test(target.name)) target = new File(target.fsName + '.pdf');
            var result = exportMarkedPDF(doc, target);
            alert('Created one PDF with ' + result.pages + ' page(s):\n' + target.fsName +
                '\n\nThe original .ai was not saved or renamed.\nInspect page count, order, fonts and links.' +
                (result.warnings.length ? '\n\n' + result.warnings.join('\n') : ''));
        } catch (e) { alert('PDF export stopped:\n' + String(e)); }
    };
    dialog.show();
})();
