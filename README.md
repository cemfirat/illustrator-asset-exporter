# Illustrator Asset Exporter

**Native Export for Screens presets. No scripts. No plugins.**

A focused set of importable Adobe Illustrator presets for web assets, iOS and Android bitmap scales, and PDF export. Use Illustrator's own dialog, keep artboard-based filenames, and choose exactly what to export.

## Start here

1. Download this repository using **Code > Download ZIP**, then extract it.
2. Open **File > Export > Export for Screens > Artboards** in Illustrator.
3. Open the presets menu beside **Formats**, choose **Import Preset**, and select `presets/Web Essentials`. The preset files have **no extension**; do not open them as artwork.
4. Select only your asset artboards, leave **Prefix** empty, and choose an output folder named `exports`.
5. Review transparency and format settings, then select **Export Artboards**.

German UI: **Datei > Exportieren > Für Bildschirme exportieren > Zeichenflächen**, then **Vorgabe importieren...**. See the [complete native workflow](docs/NATIVE_WORKFLOW.md) for selection, PDFs and troubleshooting.

## Choose a preset

| Preset | Output | Use |
| --- | --- | --- |
| **Web Essentials** | SVG; PNG 1x/2x; WebP 1x/2x | Recommended starting point for logos and web graphics |
| **Web Compatible** | SVG; PNG 1x/2x | Alternative when WebP is unavailable or unnecessary |
| **iOS PNG** | PNG 1x/2x/3x | Bitmap image variants, not App Store icons |
| **Android PNG Scales** | PNG 1x/1.5x/2x/3x/4x | Density variants, not a ready-to-use Android resource tree |
| **SVG Only** | SVG | Vector web delivery |
| **PDF Only** | PDF | A separate PDF export pass |

Import only the presets you need. See [preset details](presets/README.md) and [quality settings](docs/SETTINGS.md). WebP is exported directly by Illustrator when the installed version supports it; no converter is needed.

## Assets first. PDF pages second.

Use names such as `_fonts`, `_colors` and `_notes` to identify document pages. **The underscore is a naming convention, not an automatic filter.** Native presets do not inspect names or route different artboards to different formats.

| Pass | Select | Preset | Important setting |
| --- | --- | --- | --- |
| Assets | Only ordinary artboards | Web Essentials or another asset preset | Exclude the underscore pages |
| Document | Only underscore pages | PDF Only | **PDF Files > Single File** |

For example, when pages 1-3 are document pages and 4-20 are assets, use ranges `4-20` and `1-3`. Recheck the ranges whenever artboards move. Do not use **Full Document** as a substitute for selecting pages.

With an empty prefix and unique artboard names, `logo` is intended to produce `logo.svg`, `logo.png`, `logo@2x.png`, `logo.webp` and `logo@2x.webp` with Web Essentials. No `ui_` prefix or artboard-number prefix is requested. Inspect names after the first export; the combined PDF's filename is handled separately by Illustrator.

## Examples and your own exports

[Browse the examples](examples/README.md): the original `Logo & Assets.ai` and its supplied outputs live under `examples/`. Generated files are in **`examples/exports/`**. These existing outputs are preserved, not regenerated or presented as proof that every preset has been tested.

For your own work, export to your project's **`exports/`** folder. The root `/exports/` is ignored by Git; the intentionally included example outputs remain tracked.

## Compatibility and verification

The presets are derived from an actual Illustrator-exported file. Their structure is checked automatically, but **importing these six presets and inspecting their output in a documented Illustrator/macOS version still needs confirmation**. Existing sample files are not a substitute for that check. See [validation status](docs/VALIDATION.md).

The presets store format rows, scales and suffixes. They do not set your selected artboards, destination, prefix, color profile, transparency, codec quality, background inclusion or PDF Single File option. Those remain under your control in Illustrator.

This repository no longer includes export scripts, PDF helpers, converters or Xcode packaging tools. Historical implementations remain in Git history. App icons, favicon packages, Android XML and print-certified PDFs are separate workflows, not promised features.

## Contributing and license

[Contributing](CONTRIBUTING.md) - [Changelog](CHANGELOG.md) - [MIT license](LICENSE)

Adobe Illustrator and other product names belong to their respective owners. This independent project is not affiliated with Adobe. A software license does not grant rights to third-party trademarks or fonts shown in examples.
