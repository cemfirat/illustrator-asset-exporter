# Native presets

Import the extensionless files below using **Export for Screens > Presets menu > Import Preset**. Do not import this README. These are not scripts and not Adobe PDF `.joboptions` files.

| File | Rows |
| --- | --- |
| Web Essentials | SVG; PNG 1x/2x; WebP 1x/2x |
| Web Compatible | SVG; PNG 1x/2x |
| iOS PNG | PNG 1x/2x/3x |
| Android PNG Scales | PNG 1x/1.5x/2x/3x/4x |
| SVG Only | SVG |
| PDF Only | PDF; choose Single File separately when needed |

Raster 1x rows use no suffix; higher scales use `@2x`, `@3x`, `@1.5x` or `@4x`. SVG and PDF rows have no suffix. The PDF file retains the sample's stored scale value; this is not a claim of 2x raster PDF output.

Use an empty Prefix to keep artboard-based filenames. Select underscore pages manually in a separate PDF pass. The preset does not filter names, choose a destination, set background/transparency/color settings or enable PDF Single File.

File bytes and CR line endings are preserved from the previously prepared sample-derived presets. The row manifest lives under `.github/` for repository checks only. Import and visual checks in a documented Illustrator version remain unverified.

[Workflow](../docs/NATIVE_WORKFLOW.md) - [Quality settings](../docs/SETTINGS.md) - [Validation](../docs/VALIDATION.md)
