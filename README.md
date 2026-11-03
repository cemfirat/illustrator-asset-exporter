# Illustrator Asset Exporter

**Native presets when you want the Illustrator dialog. Scripts when you want naming rules.**

Export Adobe Illustrator artboards for iOS, Android, and web. Keep artboard-based filenames and collect underscore-marked pages into one PDF.

> **Preview, not Illustrator-certified.** This repository now contains both native Export for Screens preset files and ExtendScript tools. The presets are derived from an actual Adobe-exported preset supplied by the maintainer. Their structure and the scripts' mocked behavior are checked, but importing them and rendering exports in Illustrator still need a real macOS test. This is an independent project, not an Adobe product.

## Choose your workflow

| Workflow | Use it for | What handles `_` / literal `*` pages? |
| --- | --- | --- |
| **Native presets + small helper** | Keep the native dialog, including direct WebP export | The helper creates one PDF and shows the regular-artboard range to copy into the native dialog |
| **Full batch script** | Automated iOS, Android density folders, web PNG/SVG/JPEG and PDF routing | The full script handles the split automatically |
| **Native presets only** | No script execution | Select regular assets and marked pages in two separate native export passes |

**A native format preset does not implement a filename condition.** Its format rows apply to the artboards you select. Neither a preset nor the new helper silently changes the native dialog's selection. Do not leave **Select All** enabled when you want marked pages excluded from asset exports.

## Recommended: native presets + PDF helper

1. Download this repository with **Code > Download ZIP**, then extract it.
2. In Illustrator, open **File > Export > Export for Screens**. In the presets menu, choose **Import Preset** and select a file from [`presets/`](presets/README.md), such as `Web Essentials`. The preset files intentionally have no extension, matching the supplied Adobe export.
3. Close that dialog. Run **File > Scripts > Other Script...** and choose [`scripts/Illustrator_Native_Export_Helper.jsx`](scripts/Illustrator_Native_Export_Helper.jsx).
4. The helper shows two ranges: regular assets and PDF-only pages. Copy the regular-asset range with **Cmd+C**. Its **Export marked PDF...** button creates one PDF from `_` / literal `*` artboards only. Save current changes as a local `.ai` file first.
5. Close the helper. Reopen **Export for Screens > Artboards**, choose **Range**, paste the regular-asset range, apply the desired preset, leave **Prefix** empty, and export.

If there are no regular assets, skip step 5; an empty range is not a safe substitute for excluding everything. If the artboard order changes, rerun the helper before using its ranges.

**WebP is native in Illustrator versions that offer it in this dialog. No converter is needed for this workflow.** The optional converter below is only for outputs from the full batch script.

| Native preset | Rows |
| --- | --- |
| `Web Essentials` | SVG; PNG 1x/2x; WebP 1x/2x |
| `Web Compatible` | SVG; PNG 1x/2x, without WebP |
| `iOS PNG` | PNG 1x/2x/3x |
| `Android PNG Scales` | PNG 1x/1.5x/2x/3x/4x; not a ready-made Android resource tree |
| `SVG Only` | One SVG per selected artboard |
| `PDF Only` | PDF row; choose **Single File** separately for a combined PDF |

These files define scales, suffixes and formats only. They do **not** guarantee imported transparency, color profiles, WebP quality/lossless mode, artboard background color, selected ranges, output folders, Prefix, or the Single File PDF setting. Set those in Illustrator. See [native workflow and settings](docs/NATIVE_WORKFLOW.md).

## Alternative: full batch script

Run [`scripts/Illustrator_Asset_Exporter.jsx`](scripts/Illustrator_Asset_Exporter.jsx) with **File > Scripts > Other Script...**. Select targets and an output folder. No terminal, Node.js or Python is required for this main script.

- iOS PNG at 1x/2x/3x; Android PNG in mdpi/hdpi/xhdpi/xxhdpi/xxxhdpi folders.
- Web SVG and PNG at 1x/2x; optional JPEG at quality 85.
- `_Cover`, `_Guide` and `*Appendix` go into one PDF in artboard order, not into asset exports.
- Case-insensitive filename and generated-suffix collisions are checked before export.
- Every run creates a new `Illustrator_Export_YYYYMMDD_HHMMSS` folder and `ExportReport.txt`.

The original filename base is preserved for iOS/web: `Home.png`, `Home@2x.png`, `Home@3x.png`, `Home.svg`. No automatic `ui_` prefix or artboard numbering. **Android resource names are normalized** when needed, for example `Login Screen` to `login_screen.png`; changes appear in the report. The native Android scale preset does not perform this normalization or build Android resource directories.

The PDF filename defaults to the document name and is editable. Disabling PDF skips marked pages rather than converting them to regular assets. Active-artboard mode limits all processing, including PDF. The PDF operation uses a saved `.ai` copy, not `saveAs` on the open original. In the full script, verify linked images in the exported PDF; the smaller native helper places its temporary copy next to the source to preserve relative link paths.

### Optional helpers for the full script

```bash
# WebP: only needed when using the full script instead of native WebP export.
brew install webp
bash tools/convert_webp.sh "/path/to/Illustrator_Export_YYYYMMDD_HHMMSS" --lossless
# For photographic artwork:
bash tools/convert_webp.sh "/path/to/Illustrator_Export_YYYYMMDD_HHMMSS" --lossy 85

# Xcode image sets from the full script's iOS PNG folder:
python3 tools/build_xcassets.py "/path/to/Illustrator_Export_YYYYMMDD_HHMMSS"
```

The WebP helper requires `cwebp`. The Xcode helper requires Python 3 and creates regular `.imageset` assets with `Contents.json`, not app icons. Re-running these helpers replaces same-named generated outputs.

## What preview means for you

You may download and try the project now; a release tag is not required to use it. Test on a copy of your artwork and inspect output dimensions, transparency, colors, filenames, fonts, links and PDF page order before customer delivery. Passing CI means the automated checks passed, **not** that Adobe Illustrator rendered the files correctly.

No Illustrator/macOS version is certified yet. Native preset import also remains unverified. AVIF, Android Vector Drawable XML, specialized app icons, store screenshots, automatic profile conversion and print-certified PDF/X are not implemented. Their absence does not prevent the documented PNG/SVG/PDF workflows or native WebP export.

A version heading in the changelog is documentation, not a GitHub Release. A tag marks a particular commit; a release packages a version with notes. Neither is a guarantee of quality.

See [format strategy](docs/EXPORT_FORMATS.md), [native workflow](docs/NATIVE_WORKFLOW.md), [full-script testing checklist](docs/TESTING.md) and [contributing](CONTRIBUTING.md).

## License

[MIT](LICENSE). Copyright (c) 2026 Cem Firat.

Adobe Illustrator, Xcode, Android and related names are trademarks of their respective owners. This project is not affiliated with Adobe, Apple or Google.
