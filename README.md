# Illustrator Asset Exporter

**Native Export for Screens presets. No scripts. No plugins.**

A focused set of importable Adobe Illustrator presets for web assets, iOS and Android bitmap scales, and PDF export. Use Illustrator's own dialog, keep artboard-based filenames, and choose exactly what to export.

**[Download presets only](downloads/illustrator-native-export-presets.zip?raw=1)** - [Quick start](downloads/START_HERE.md) - [Example artwork](examples/README.md)

The small ZIP contains seven presets, a guide and the license. No example artwork or executable tools are included. [Package details and checksum](downloads/README.md).

## Start here

1. Download the presets-only ZIP above, then extract it. For the full source and examples, use **Code > Download ZIP** instead.
2. Open **File > Export > Export for Screens > Artboards** in Illustrator.
3. Open the presets menu beside **Formats**, choose **Import Preset**, and select `presets/All Formats` for the complete bundle, or `presets/Web Essentials` for lean web output. The files have **no extension**; do not open them as artwork.
4. Select only your asset artboards, leave **Prefix** empty, and choose an output folder named `exports`.
5. Review transparency and format settings, then select **Export Artboards**.

German UI: **Datei > Exportieren > Für Bildschirme exportieren > Zeichenflächen**, then **Vorgabe importieren...**. See the [complete native workflow](docs/NATIVE_WORKFLOW.md) for selection, PDFs and troubleshooting.

## Choose a preset

| Preset | Output | Use |
| --- | --- | --- |
| **All Formats** | SVG; PNG 1x/1.5x/2x/3x/4x; WebP 1x/2x; JPG 100 1x/2x; PDF | Complete asset bundle, 11 rows without duplicate PNGs |
| **Web Essentials** | SVG; PNG 1x/2x; WebP 1x/2x | Lean starting point for logos and web graphics |
| **Web Compatible** | SVG; PNG 1x/2x | Alternative when WebP is unavailable or unnecessary |
| **iOS PNG** | PNG 1x/2x/3x | Bitmap image variants, not App Store icons |
| **Android PNG Scales** | PNG 1x/1.5x/2x/3x/4x | Density variants, not a ready-to-use Android resource tree |
| **SVG Only** | SVG | Vector web delivery |
| **PDF Only** | PDF | A separate PDF export pass |

Import only the presets you need. See [preset details](presets/README.md) and [quality settings](docs/SETTINGS.md). WebP is exported directly by Illustrator when the installed version supports it; no converter is needed.

## One preset for the complete bundle

**All Formats** combines the existing preset outputs and adds JPG 100 at 1x/2x. PNG scales are exported once each, rather than duplicated for iOS, Android and web. This covers the project's five screen/PDF format families, not every format Illustrator supports. It does not create platform resource folders or icon packages.

Use **Create Subfolders > Format** and leave **Prefix** empty. Set **PDF Files > Multiple Files** for one PDF per selected asset. These options must be set in Illustrator; the preset does not set them. JPG output is opaque, even at quality 100. Review its background; Web Essentials remains the smaller alternative without JPEG or asset PDFs.

## Assets first. PDF pages second.

Use names such as `_fonts`, `_colors` and `_notes` to identify document pages. **The underscore is a naming convention, not an automatic filter.** Native presets do not inspect names or route different artboards to different formats.

| Pass | Select | Preset | Important setting |
| --- | --- | --- | --- |
| Assets | Only ordinary artboards | All Formats, Web Essentials or another asset preset | Exclude underscore pages; All Formats: PDF Multiple Files for individual asset PDFs |
| Document | Only underscore pages | PDF Only | **PDF Files > Single File** |

All Formats applies every format to every selected artboard, including the PDF row. For example, when pages 1-3 are document pages and 4-20 are assets, use ranges `4-20` and `1-3` in separate passes. Recheck the ranges and PDF Single File/Multiple Files setting between passes. Do not use **Full Document** as a substitute for selecting pages.

With an empty prefix and unique artboard names, `logo` is intended to produce artboard-based filenames such as `logo.svg`, `logo.png`, `logo@2x.png`, `logo.webp` and `logo@2x.webp`. All Formats adds the extra PNG scales, `logo.jpg`, `logo@2x.jpg` and an asset PDF. No `ui_`, artboard-number or `-100` filename suffix is requested. Inspect names after the first export; the combined PDF's filename is handled separately by Illustrator.

## Examples and your own exports

[Browse the examples](examples/README.md): the original `Logo & Assets.ai` and its supplied outputs live under `examples/`. Generated files are in **`examples/exports/`**. Actual artwork is preserved, not regenerated or presented as proof that every preset has been tested.

For your own work, export to your project's **`exports/`** folder. For several targets, use `exports/web/`, `exports/ios/` and `exports/android/` to avoid accidental overwrites. The root `/exports/` is ignored by Git; intentionally included example outputs remain tracked.

## Compatibility and verification

The presets are derived from an actual Illustrator-exported file. Their structure and the download package are checked automatically, but **importing these seven presets and inspecting their output in a documented Illustrator/macOS version still needs confirmation**. Existing sample files are not a substitute for that check. See the [test matrix and validation status](docs/VALIDATION.md).

The presets store format rows, scales and suffixes; All Formats also selects the native JPG 100 variant. They do not set your selected artboards, destination, prefix, color profile, transparency, WebP compression settings, background inclusion or PDF Single File/Multiple Files option. Review detailed format settings in Illustrator.

This repository does not include export scripts, PDF helpers, converters or Xcode packaging tools. Historical implementations remain in Git history. App icons, favicon packages, Android XML and print-certified PDFs are separate workflows, not promised features. Repository checks under `.github/` are maintenance-only; users run nothing outside Illustrator.

## Contributing and license

[Contributing](CONTRIBUTING.md) - [Changelog](CHANGELOG.md) - [MIT license](LICENSE)

Adobe Illustrator and other product names belong to their respective owners. This independent project is not affiliated with Adobe. A software license does not grant rights to third-party trademarks or fonts shown in examples.
