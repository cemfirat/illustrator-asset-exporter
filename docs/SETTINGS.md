# Format and quality settings

These are practical starting points, not one universal quality setting. The importable presets specify format rows, scales and suffixes; the following options must be checked in Illustrator separately.

## Logos and web graphics

| Setting | Starting point |
| --- | --- |
| Preset | Web Essentials; use Web Compatible when WebP is not needed |
| Prefix | Empty |
| Subfolders | Enabled, organized by format |
| PNG | Full-color PNG, transparent background where required; avoid PNG-8 as a blanket default |
| Artboard color | Exclude for transparent delivery; include only intentionally |
| WebP | Lossless for crisp logos/UI; compare lossy settings for photographic artwork |
| Anti-aliasing | Inspect Art Optimized for logos/illustration; test Type Optimized for text-heavy raster assets |
| SVG text | Outlines for a fixed logo appearance when appropriate; retain an editable source separately |
| SVG images | Embed required raster images for self-contained delivery |
| SVG precision | Start around 3 decimals; increase if small details visibly change |
| SVG responsive | Enable for fluid web use when suitable; verify the viewBox and intended display size |
| Color | Prepare an intentional RGB/sRGB workflow and compare output in a color-managed viewer |

Transparent artwork can still look opaque if it contains a filled rectangle. Disabling artboard-color inclusion does not remove drawn objects. Changing RGB mode alone is not a complete color-profile conversion.

SVG is the vector option for appropriate web logos and icons. PNG and WebP are raster alternatives. Do not generate 5x, 10x, 20x and 33x variants by default; choose sizes required by the actual handoff. Ordinary scale multipliers do not generate a complete favicon package or store-icon set.

JPEG is useful for photographic or deliberately opaque output, but does not preserve transparency. Add a JPEG row manually only when needed; do not add JPEG to every logo export. TIFF, EPS, AI and specialized print formats are outside this small screen-preset collection.

## iOS bitmap delivery

**iOS PNG** produces 1x, 2x and 3x files. Treat 1x as the design base; retain only the variants the receiving project needs. Xcode recognizes `@2x` and `@3x` filename suffixes when importing images. These are ordinary bitmap assets, not an automatically generated asset catalog or app-icon set.

## Android bitmap delivery

**Android PNG Scales** produces the following scales relative to mdpi:

| Scale | Density | Typical destination after developer preparation |
| --- | --- | --- |
| 1x | mdpi | drawable-mdpi |
| 1.5x | hdpi | drawable-hdpi |
| 2x | xhdpi | drawable-xhdpi |
| 3x | xxhdpi | drawable-xxhdpi |
| 4x | xxxhdpi | drawable-xxxhdpi |

The preset only exports size variants with suffixes. It does not create these Android resource directories, remove suffixes or normalize resource names. A developer must prepare valid resource names and place the variants into the correct folders. It is not an adaptive launcher icon or Vector Drawable XML workflow. Legacy ldpi and other special densities are not included in this preset.

## PDF delivery

**PDF Only** is an Export for Screens format preset, not an Adobe PDF `.joboptions` quality preset. Select **Single File** and the intended artboards separately. Choose the actual PDF quality/color settings for the destination. Check whether editable Illustrator data should be embedded. This project does not certify PDF/X compliance or replace a printer's specifications.

## References

Reviewed on 2026-11-03:

- [Adobe: PNG, SVG, JPEG and WebP export settings](https://helpx.adobe.com/illustrator/desktop/save-and-export/export-files-to-different-formats/export-file-format-options-in-illustrator.html)
- [Adobe: PDF options](https://helpx.adobe.com/uk/illustrator/using/pdf-options.html)
- [Apple: importing images into Xcode](https://developer.apple.com/documentation/xcode/adding-images-to-your-xcode-project)
- [Android: resources and density variants](https://developer.android.com/guide/topics/resources/providing-resources)
