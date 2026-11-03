# Validation status

## Automated checks

The six extensionless preset files are derived from a maintainer-supplied Illustrator export. Repository checks parse their collection structure, suffix byte lengths, scale values and observed format identifiers, and compare all 18 rows against `.github/preset-manifest.json`.

The native files retain their existing bytes and CR line endings. Format identifiers come from the supplied sample; they are not a published cross-version compatibility contract.

Additional checks verify that the [presets-only ZIP](../downloads/README.md) contains exactly the six presets, quick-start guide and license, byte-for-byte matching the repository; its SHA-256 checksum matches; internal Markdown file links resolve; no export scripts or known desktop-metadata placeholders are tracked.

**These checks do not launch Illustrator, import a preset, render artwork or inspect visual fidelity.** A green workflow is not a certification of the export result. Existing example outputs do not establish that these exact six presets generated them.

## Illustrator compatibility record

| Preset | Structure/package | Recorded Illustrator import and render test |
| --- | --- | --- |
| Web Essentials | Automated checks available | Not yet recorded |
| Web Compatible | Automated checks available | Not yet recorded |
| iOS PNG | Automated checks available | Not yet recorded |
| Android PNG Scales | Automated checks available | Not yet recorded |
| SVG Only | Automated checks available | Not yet recorded |
| PDF Only | Automated checks available | Not yet recorded |

No specific Illustrator/macOS version is currently listed as verified. Update this table only with an actual test report, including exact versions and which presets were tested.

## Small first-run test

Create a disposable RGB document with `_Cover`, `Logo` and `_Notes`. Make `Logo` exactly 100 x 100 px, aligned to whole pixels, and leave part of it transparent. Export each test to a fresh folder, with Prefix empty and underscore pages selected manually in the PDF pass.

| Preset and selection | Expected files / result |
| --- | --- |
| Web Essentials; artboard 2 | `Logo.svg`; `Logo.png` (100 x 100), `Logo@2x.png` (200 x 200); `Logo.webp` (100 x 100), `Logo@2x.webp` (200 x 200) |
| Web Compatible; artboard 2 | The same SVG and two PNGs; no WebP |
| iOS PNG; artboard 2 | `Logo.png` (100 x 100), `Logo@2x.png` (200 x 200), `Logo@3x.png` (300 x 300) |
| Android PNG Scales; artboard 2 | `Logo.png` (100 x 100), `Logo@1.5x.png` (150 x 150), `Logo@2x.png` (200 x 200), `Logo@3x.png` (300 x 300), `Logo@4x.png` (400 x 400) |
| SVG Only; artboard 2 | `Logo.svg`; inspect the artboard extent, text and clipping |
| PDF Only; artboards 1 and 3; Single File | One PDF with two pages, ordered `_Cover`, `_Notes`; verify its actual filename |

Check transparency against light and dark backgrounds and compare colors, fonts, effects and linked/embedded images. Android outputs are scale variants, not ready-to-install resources: names and density folders still need developer preparation. UI labels and output behavior may differ by version; report mismatches rather than silently treating them as a pass.

## Report a result

Use the repository's **Issues > New issue > Native preset compatibility report**. The [report template](../.github/ISSUE_TEMPLATE/compatibility_report.md) includes the required environment and output details.

Do not upload private client work, local filesystem paths or font files. A completed report can establish verified behavior for that exact environment and the tested presets; it does not certify every version.
