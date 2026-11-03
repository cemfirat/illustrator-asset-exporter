# Native presets

Import the extensionless files below using **Export for Screens > Presets menu > Import Preset**. Do not import this README. These are not scripts and not Adobe PDF `.joboptions` files.

| File | Rows |
| --- | --- |
| All Formats | SVG; PNG 1x/1.5x/2x/3x/4x; WebP 1x/2x; JPG 100 1x/2x; PDF |
| Web Essentials | SVG; PNG 1x/2x; WebP 1x/2x |
| Web Compatible | SVG; PNG 1x/2x |
| iOS PNG | PNG 1x/2x/3x |
| Android PNG Scales | PNG 1x/1.5x/2x/3x/4x |
| SVG Only | SVG |
| PDF Only | PDF; choose Single File separately when needed |

Raster 1x rows use no suffix; higher scales use `@2x`, `@3x`, `@1.5x` or `@4x`. SVG and PDF rows have no suffix. The PDF file retains the sample's stored scale value; this is not a claim of 2x raster PDF output.

## All Formats: one preset for the complete asset bundle

**All Formats** combines every output row from the focused presets, without duplicate PNGs, and adds **JPG 100 at 1x and 2x**. It has **11 rows across five format families**: SVG, PNG, WebP, JPEG and PDF. "All" refers to this screen/PDF bundle, not every file type Illustrator supports or every artboard in the document.

Select only the asset artboards, leave **Prefix** empty and enable **Create Subfolders > Format**. For one PDF per selected asset, set **PDF Files > Multiple Files** separately; the preset does not store this choice. For the `_` pages, run a second pass using **PDF Only > Single File**. Recheck this setting when switching passes.

All Formats applies **all 11 rows to every selected artboard**. It cannot export only PDF for names beginning with `_`. Do not select those pages in the asset pass. JPG 100 selects the native high-quality JPEG variant, but JPEG remains lossy and has no transparency; check the intended background and colors. WebP quality and other detailed format settings still need to be reviewed in Illustrator.

Use an empty Prefix to keep artboard-based filenames. The presets do not filter names, choose a destination, set background/transparency/color settings or select PDF Single File/Multiple Files.

The original six preset files retain their bytes and CR line endings. All Formats follows the same sample-derived structure, including JPG 100's observed format identifier. The row manifest lives under `.github/` for repository checks only. Import and visual checks in a documented Illustrator version remain unverified.

[Workflow](../docs/NATIVE_WORKFLOW.md) - [Quality settings](../docs/SETTINGS.md) - [Validation](../docs/VALIDATION.md)
