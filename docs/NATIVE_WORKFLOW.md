# Native presets, with or without a PDF helper

## Why both approaches exist

Illustrator's native Export for Screens dialog is the preferred route when you want visual control and its native WebP settings. The full batch script remains useful when you want automatic platform folders and rule-based routing. A preset stores format rows; it is not an `if artboard.name starts with '_'` rule.

## Hybrid workflow

1. Import a preset from `presets/` using the presets menu in Export for Screens. Close the native export dialog before running scripts.
2. Run `scripts/Illustrator_Native_Export_Helper.jsx` through File > Scripts > Other Script.
3. Copy the displayed **regular-asset range**. For example, if artboards 1-3 are marked and 4-20 are assets, it is `4-20`. Mixed positions can produce `2,4-7,9`.
4. Use **Export marked PDF...** to save one PDF containing all `_` and literal `*` pages in artboard order. The helper does not raster-export them. With no marked pages, this button is disabled.
5. Close the helper. Open Export for Screens, select the Artboards tab and **Range**, and paste the regular-asset range. Do not select All or Full Document. Apply the asset preset and export.

The helper does not import a preset, edit native settings, fill the Range box, or press Export for you. It leaves normal asset export to the native interface. Rerun it after reordering or renaming artboards.

For PDF output, save changes as a local `.ai` first. The source directory must be writable: the helper creates a uniquely named temporary copy **beside the source**, which helps keep relative image links valid. It saves the PDF from that copy, closes the copy without saving further changes, and removes it when possible. It never deliberately saves or closes the original. Existing PDF files are rejected rather than overwritten. Check any warning about temporary copies or partially written PDFs.

## Fully native: no script

Use two passes. First select only regular artboards and export with a web/iOS/Android preset. Then select only the marked artboards, apply `PDF Only`, and choose **PDF Files > Single File**. In the German UI this is **PDF-Dateien exportieren als > Einzelne Datei**, not **Mehrere Dateien**. The preset alone does not enforce that choice, identify underscores or guarantee the combined PDF's basename; check the resulting filename.

## Settings to review once in Illustrator

| Setting | Suggested starting point |
| --- | --- |
| Prefix | Empty; keep artboard-based names |
| Base artboard size | Intended 1x size, not an arbitrary high-resolution screenshot |
| Transparent logos/icons | PNG transparency on; disable Include Artboard Color when the artboard color should not be baked in |
| Background artwork | An actual background rectangle still exports even with artboard-color inclusion off |
| WebP | Lossless for crisp logos/UI; consider lossy for photos after visual comparison |
| SVG | Check text/font handling, viewBox, clipping and embedded raster images |
| Color | Prepare and verify the intended RGB/sRGB workflow; the preset does not convert profiles |
| Subfolders | Organize by format or scale to suit the handoff; avoid duplicate filenames |
| Combined PDF | Only marked pages selected; Single File enabled |

These are project starting points, not a universal optimal-quality guarantee. Most brand assets do not need simultaneous 5x, 10x, 20x and 33x raster exports. SVG already provides scalable vector output where appropriate. Native Android scale exports are not Android Vector Drawables or pre-normalized Android resource folders; use the full script for the latter PNG folder layout.

## First-run verification

Use a small disposable document with `_Cover`, `Logo` and `_Notes`. Import `Web Essentials` and verify its five rows: SVG, PNG 1x/2x, WebP 1x/2x. With the helper, the asset range must be `2`, and the PDF must contain two pages in the order `_Cover`, `_Notes`. Export only asset range `2`; inspect names, alpha, pixel dimensions and colors. Confirm the original `.ai` remains open and unchanged by the PDF operation.

Also test a non-contiguous PDF selection, existing PDF filename, unsaved document and linked image. Record exact Illustrator and macOS versions and the outcomes. Automated checks cannot establish these results.

## References

- [Adobe: Export for Screens](https://helpx.adobe.com/illustrator/desktop/save-and-export/export-files-to-different-formats/export-artboards-and-assets-for-screens.html)
- [Adobe: native preset import/export and format settings](https://helpx.adobe.com/illustrator/using/collect-assets-export-for-screens.html)
- [GitHub: releases and tags](https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases)
