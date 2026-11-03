# Illustrator Native Export Presets

Native Export for Screens presets. No export scripts, plugins, terminal commands or converters are required.

## Import

Extract this ZIP. In Adobe Illustrator, open **File > Export > Export for Screens > Artboards**. Open the presets menu beside **Formats**, choose **Import Preset**, and select an extensionless file from `presets/`. Choose **All Formats** for the complete asset bundle or **Web Essentials** for lean web output. Import **PDF Only** for a separate document pass.

German UI: **Datei > Exportieren > Für Bildschirme exportieren > Zeichenflächen > Vorgabe importieren...**

Do not use File > Open. Do not import this guide or LICENSE. Keep the preset filenames without an extension. If WebP is unavailable, use **Web Compatible**. If an import fails, recreate the rows below in Illustrator and save a native preset there; do not guess an extension.

## Choose only the outputs you need

| Preset | Format rows |
| --- | --- |
| All Formats | SVG; PNG 1x/1.5x/2x/3x/4x; WebP 1x/2x; JPG 100 1x/2x; PDF |
| Web Essentials | SVG; PNG 1x/2x; WebP 1x/2x |
| Web Compatible | SVG; PNG 1x/2x |
| iOS PNG | PNG 1x/2x/3x |
| Android PNG Scales | PNG 1x/1.5x/2x/3x/4x |
| SVG Only | SVG |
| PDF Only | PDF |

At 1x, no suffix is added. Higher raster scales use `@2x`, `@3x`, `@1.5x` or `@4x`. SVG/PDF have no suffix. The stored PDF scale is not a raster-resolution instruction. Native format identifiers are derived from a supplied Illustrator export, not a published cross-version contract.

## All Formats: one preset for the complete asset bundle

**All Formats** combines every output row from the focused presets, without duplicate PNGs, and adds **JPG 100 at 1x and 2x**. It has **11 rows across five format families**: SVG, PNG, WebP, JPEG and PDF. "All" refers to this screen/PDF bundle, not every file type Illustrator supports or every artboard in the document.

Select only the asset artboards, leave **Prefix** empty and enable **Create Subfolders > Format**. For one PDF per selected asset, set **PDF Files > Multiple Files** separately; the preset does not store this choice. For the `_` pages, run a second pass using **PDF Only > Single File**. Recheck this setting when switching passes.

All Formats applies **all 11 rows to every selected artboard**. It cannot export only PDF for names beginning with `_`. Do not select those pages in the asset pass. JPG 100 selects the native high-quality JPEG variant, but JPEG remains lossy and has no transparency; check the intended background and colors. WebP quality and other detailed format settings still need to be reviewed in Illustrator.

## Export assets

Select only ordinary asset artboards. Leave **Prefix** empty. Choose a new `exports/` folder and enable **Create Subfolders > Format**. For multiple targets, use separate `exports/web/`, `exports/ios/` and `exports/android/` folders.

For transparent artwork, check the format's transparency settings and turn off **Include Artboard Color** when appropriate. An actual background rectangle still exports. Use intentional RGB/sRGB settings, inspect SVG text and clipping, and compare lossless WebP for crisp graphics. The presets do not enforce these settings.

Use unique artboard names, including when ignoring case. Avoid slashes and pre-existing scale suffixes such as `@2x`. Example: `logo` with Web Essentials is intended to produce `logo.svg`, `logo.png`, `logo@2x.png`, `logo.webp` and `logo@2x.webp`. Verify the first output; the preset does not validate filenames.

## Export one document PDF

Clear the asset selection. Select only pages such as `_fonts`, `_colors` and `_notes`. Choose **PDF Only** and **PDF Files > Single File** (German: **PDF-Dateien exportieren als > Einzelne Datei**). Check PDF quality settings separately; this is not a `.joboptions` or certified print preset. Inspect and, if needed, rename the combined PDF after export.

The underscore is only a naming convention, not an automatic filter. For document pages 1-3 and asset pages 4-20, use asset range `4-20`, then PDF range `1-3`. Recheck after reordering artboards.

## Verify once in your environment

Use a disposable RGB document with `_Cover`, `Logo` and `_Notes`. Make `Logo` 100 x 100 px, with some transparency. Web Essentials on artboard 2 should create five files: one SVG, two PNGs and two WebP files. The raster sizes should be 100 x 100 and 200 x 200 px. PDF Only on artboards 1 and 3 with Single File should create one two-page PDF.

Test All Formats on artboard 2 with PDF Multiple Files: expect one SVG, five PNGs (100/150/200/300/400 px), two WebP files and two JPGs (100/200 px), and one PDF. Confirm the imported JPG rows say JPG 100. JPEG output must be opaque; inspect its background. This is 11 files for this one-artboard test.

The iOS and Android presets only create bitmap scales: they do not create asset catalogs, Android resource directories, app icons or favicon packages. AVIF and Android XML are not included.

Preset structure and package contents are checked automatically. Actual import/render behavior in a documented Illustrator/macOS version is not yet confirmed. Record the exact app and OS versions plus observed output before relying on a preset for delivery.

Project: cemfirat/illustrator-asset-exporter on GitHub. Full documentation and compatibility reports are available there. License: MIT; see LICENSE. Independent project; not affiliated with Adobe.
