# Illustrator Asset Exporter

**Your artboard names. Organized assets. One PDF for marked pages.**

Batch-export Adobe Illustrator artboards for iOS, Android, and web with original filenames, multi-scale assets, and rule-based multi-page PDFs.

> **Preview: Illustrator runtime validation is still required.** Automated checks cover JavaScript syntax, mocked filename preflight, and helper tools. They do not run Adobe Illustrator or prove export fidelity. This is an independent ExtendScript project, not an Adobe product or an importable Export for Screens preset.

## What it does

- **Keeps your names:** `Home` becomes `Home.png`, `Home@2x.png`, `Home@3x.png`, and `Home.svg` where those targets are enabled. No `ui_` prefix and no added artboard numbers.
- **Routes marked artboards to one PDF:** `_Cover`, `_Guide`, and `*Appendix` become pages in the same PDF, in Illustrator artboard order. They are never included in PNG, JPEG, or SVG asset exports.
- **Exports platform densities:** iOS PNG at 1x/2x/3x; Android PNG at mdpi/hdpi/xhdpi/xxhdpi/xxxhdpi; web SVG and PNG at 1x/2x, plus optional JPEG.
- **Checks filenames before exporting:** detects case-insensitive duplicates, generated scale collisions, invalid names, and Android normalization collisions.
- **Protects the source:** the PDF operation uses a temporary copy of a saved `.ai` file, not `saveAs` on your open original.
- **Includes optional tools:** WebP conversion and Xcode `.imageset` packaging. Neither requires changes to the Illustrator script.

## Quick start on macOS

1. Download this repository with **Code > Download ZIP**, then extract it.
2. Open your artwork in Adobe Illustrator. Save the latest changes as `.ai` before exporting a combined PDF.
3. Choose **File > Scripts > Other Script...** (German UI: **Datei > Skripten > Anderes Skript...**).
4. Select [`scripts/Illustrator_Asset_Exporter.jsx`](scripts/Illustrator_Asset_Exporter.jsx).
5. Choose the export targets and destination folder.
6. Check `ExportReport.txt` and inspect your output before using it in production.

The main script runs inside Illustrator. **No terminal, Python, Node.js, or external converter is needed for the main export.** Each run creates a new `Illustrator_Export_YYYYMMDD_HHMMSS` folder.

## Naming rules

| Artboard name | Result |
| --- | --- |
| `Home` | Original base name for iOS/web; scale suffixes where applicable |
| `Login Screen` | Spaces and capitalization preserved for iOS/web |
| `_Cover` | A page in the combined PDF only |
| `_Instructions` | Another page in that same PDF only |
| `*Appendix` | Also treated as PDF-only; `*` is a literal alternative marker, not a wildcard |

**Android is the exception:** resource filenames are normalized, for example `Login Screen` becomes `login_screen.png`. Changes appear in the report. The artboards themselves are not renamed.

The PDF filename defaults to the document name and is editable in the export dialog. Disable the PDF option to **skip marked artboards**, not to export them as regular assets. Active-artboard mode limits all routing, including PDF, to the active artboard.

Use unique names and avoid reserved `@1x`, `@2x`, and `@3x` suffixes. `Logo` and `Logo@2x` would collide when scale variants are generated. Invalid filenames are rejected rather than silently renamed. Filename validation is conservative; Unicode normalization edge cases still need real macOS testing.

## Export matrix

| Target | Included in the JSX | Optional helper / roadmap |
| --- | --- | --- |
| iOS / iPadOS | PNG 1x, 2x, 3x | Xcode `.imageset` helper included; vector PDF image assets planned |
| Android | PNG 1x, 1.5x, 2x, 3x, 4x in density folders | Vector Drawable XML conversion planned |
| Web | SVG; PNG 1x/2x; optional JPEG 1x/2x at quality 85 | WebP helper included; AVIF planned |
| `_` / `*` pages | One multi-page PDF | Document PDF, not a print-certified PDF/X preset |

### Example output

```text
Illustrator_Export_YYYYMMDD_HHMMSS/
  iOS/PNG/Home.png, Home@2x.png, Home@3x.png
  Android/drawable-mdpi/home.png
  Android/drawable-hdpi/home.png
  Android/drawable-xhdpi/home.png
  Android/drawable-xxhdpi/home.png
  Android/drawable-xxxhdpi/home.png
  Web/PNG/Home.png, Home@2x.png
  Web/SVG/Home.svg
  Web/JPG/Home.jpg, Home@2x.jpg       (optional)
  PDF/MyDocument.pdf                (marked pages only)
  ExportReport.txt
```

### Optional WebP conversion

The included converter reads `Web/PNG` and writes `Web/WebP`, preserving base names:

```bash
brew install webp
bash tools/convert_webp.sh "/path/to/Illustrator_Export_YYYYMMDD_HHMMSS" --lossless
# For photographic artwork instead:
bash tools/convert_webp.sh "/path/to/Illustrator_Export_YYYYMMDD_HHMMSS" --lossy 85
```

Requires `cwebp`; this is **not a checkbox in the JSX dialog**. Adobe documents WebP in its own export UI, but that does not establish compatibility for this script's automation path. Re-running the helper replaces same-named generated WebP files.

### Optional Xcode image sets

```bash
python3 tools/build_xcassets.py "/path/to/Illustrator_Export_YYYYMMDD_HHMMSS"
```

Creates `Xcode/Assets.xcassets/<artboard-name>.imageset` folders containing PNGs and `Contents.json`. Copy the `.imageset` folders into an Xcode asset catalog. Python 3 is required; no third-party Python packages are needed. Re-running replaces files for the same image sets. These are ordinary bitmap assets, **not app icons**.

## Before production use

Design at the intended **1x logical size**; the exporter multiplies that size, it does not infer device dimensions. Review RGB/sRGB settings, transparency, raster-effect resolution, fonts, clipping, and linked images. For PDF export, embed linked images or verify all links resolve in the temporary copy.

The script does not implement automatic color-profile conversion, native preset import, AVIF, Android XML conversion, app/launcher icons, store screenshots, or PDF/X preflight. SVG artboard selection and PDF page order must be checked in your installed Illustrator version. No Illustrator/macOS version is certified yet.

See [format strategy](docs/EXPORT_FORMATS.md), [testing checklist](docs/TESTING.md), and [contributing](CONTRIBUTING.md).

## License

[MIT](LICENSE). Copyright (c) 2026 Cem Firat.

Adobe Illustrator, Xcode, Android, and related names are trademarks of their respective owners. This project is not affiliated with Adobe, Apple, or Google.
