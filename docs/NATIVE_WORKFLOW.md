# Native workflow

Everything in this workflow happens in Illustrator's **Export for Screens** dialog. No script, terminal or converter is required.

## 1. Import once

Download and extract the presets-only ZIP or the repository ZIP. Open **File > Export > Export for Screens**, select **Artboards**, and open the presets menu beside **Formats**. Choose **Import Preset** and select an extensionless file from `presets/`. Choose **All Formats** for the complete asset bundle or **Web Essentials** for lean web output. Repeat for **PDF Only** or other presets you actually need.

Use **Import Preset**, not File > Open, and do not select the README. Importing a preset is separate from choosing the artboards to export. Check the imported rows against the [preset table](../presets/README.md).

If your version does not offer WebP, use **Web Compatible**. If an import fails, recreate the listed rows in Illustrator and use **Save As Preset**. Report the exact Illustrator version; changing a file extension is not a verified fix.

## 2. Prepare names and dimensions

Give every asset a unique artboard name. Keep the name you want in the exported file, such as `logo`, `logo-inverted` or `icon`. Leave **Prefix** empty: do not choose Artboard Number, Increasing Number or File Name as a prefix.

At 1x, a 100 x 100 px artboard should produce a 100 x 100 px raster export; 2x produces 200 x 200 px. Work at an intentional base size and verify dimensions, especially with large-canvas documents or fractional artboard coordinates. A higher scale cannot restore missing detail in a placed bitmap.

Use `_fonts`, `_colors` and similar names as a visual marker for PDF pages. The underscore has no special meaning to Illustrator's native export selection. Do not add a literal asterisk as an automation marker; this workflow has no name parser.

Keep names unique even when ignoring case. Avoid slashes, control characters and names that already end in `@2x` or `@3x` when the preset generates those suffixes. There is no custom collision-checking script.

## 3. Export assets

Select **Artboards** and select only the ordinary asset artboards, using thumbnails or **Range**. Exclude the underscore pages manually. Choose **All Formats**, **Web Essentials** or the relevant platform preset.

**All Formats** applies all 11 rows to every selected artboard: SVG, five PNG scales, two WebP scales, two JPG 100 scales and PDF. For one PDF per asset, choose **PDF Files > Multiple Files** manually. It cannot apply the PDF row only to underscore pages. Select those pages separately with PDF Only in step 4.

Set the destination to a fresh `exports/` folder in your project. For mixed-format presets, enable **Create Subfolders > Format** to separate the output types. Folder labels can vary with Illustrator version; keep Illustrator's generated labels rather than renaming every exported file.

For transparent logos, review PNG transparency and disable **Include Artboard Color** when that color should not be included. A background rectangle in the artwork still exports. JPEG is opaque; inspect its background separately. Review the [quality settings](SETTINGS.md), export, and inspect the results.

When exporting for several platforms, use separate destinations such as `exports/web/`, `exports/ios/` and `exports/android/` to avoid overwriting similarly named PNGs. Use a new destination for a materially different export so stale files are not mistaken for current output.

## 4. Export one PDF

Clear the asset selection. Select only the underscore pages, apply **PDF Only**, and choose **PDF Files > Single File**. In German: **PDF-Dateien exportieren als > Einzelne Datei**, not **Mehrere Dateien**. Recheck this choice after an All Formats pass using Multiple Files.

Check the PDF format settings separately. The preset supplies one PDF format row; it does not activate Single File or install an Adobe PDF quality preset. Export, then inspect the actual filename, page count and page order in Preview or Acrobat. Rename the combined file in Finder if necessary, for example `brand-guide.pdf`.

For a review/distribution PDF rather than an editable source handoff, review the chosen Adobe PDF settings and disable **Preserve Illustrator Editing Capabilities** when source data should not be embedded. Keep the editable `.ai` separately. This is not a redaction or sanitization guarantee.

Example: pages 1-3 are `_fonts`, `_colors`, `_notes`, and pages 4-20 are assets. The asset pass uses `4-20`; the PDF pass uses `1-3`. A native preset cannot turn this into a conditional one-click export. Check the thumbnails after any reorder or rename.

## 5. Check before delivery

Confirm filenames and pixel dimensions, transparency against light and dark backgrounds, colors, fonts, clipping and placed images. Verify that only the intended pages appear in the PDF. Inspect the output, not merely the import dialog.

Do not test by overwriting the checked-in examples. Use a duplicate source document and a new local output folder. The supplied [examples](../examples/README.md) are reference material, not a guaranteed expected-output test suite.

## References

Reviewed on 2026-11-03:

- [Adobe: Export for Screens selection, formats, prefixes and subfolders](https://helpx.adobe.com/illustrator/desktop/save-and-export/export-files-to-different-formats/export-artboards-and-assets-for-screens.html)
- [Adobe: save, import and export custom presets](https://helpx.adobe.com/illustrator/desktop/save-and-export/export-files-to-different-formats/collect-and-export-assets-from-asset-export-panel.html)
- [Adobe: PDF options and editable Illustrator data](https://helpx.adobe.com/uk/illustrator/using/pdf-options.html)

The Single File label is also visible in the maintainer-supplied Illustrator dialog screenshot. UI labels and available options can differ by version.
