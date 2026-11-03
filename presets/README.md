# Native Export for Screens presets

Import one of the six extensionless files through Illustrator's **Export for Screens > Presets menu > Import Preset**. Do not import this README or `manifest.json`.

| File | Formats / scales |
| --- | --- |
| `Web Essentials` | SVG + PNG 1x/2x + WebP 1x/2x |
| `Web Compatible` | SVG + PNG 1x/2x |
| `iOS PNG` | PNG 1x/2x/3x |
| `Android PNG Scales` | PNG 1x/1.5x/2x/3x/4x |
| `SVG Only` | SVG |
| `PDF Only` | PDF; select Single File in the dialog for one combined document |

The files are derived from the maintainer's Adobe-exported preset, preserving its CR line endings, `/collectionN` layout, hexadecimal suffix encoding, metadata and observed format identifiers. Identifiers are sample-derived, not a documented cross-version Adobe compatibility guarantee. The PDF row retains the sample's stored scale value; PDF has no raster scale selector in the supplied dialog.

**Validation:** parsed and structurally checked, but not yet imported into a running Illustrator installation. Try `Web Compatible` if your version does not support WebP.

The presets contain format rows, not conditional routing or complete application settings. Set **Range**, **Prefix**, transparency, artboard background, codec quality, folder options and PDF Single File manually. Names use no added project prefix; higher raster scales use `@2x`, `@3x` and similar suffixes. Native exports do not include the full script's collision preflight or Android resource naming/folder conversion.

Do not export all artboards with all presets. Exclude `_` / literal `*` artboards from asset passes and export them separately as one PDF. The [native helper](../scripts/Illustrator_Native_Export_Helper.jsx) computes the ranges and can write that PDF.

See the [step-by-step native workflow](../docs/NATIVE_WORKFLOW.md). The uploaded original preset and any client artwork/screenshots are intentionally not included.
