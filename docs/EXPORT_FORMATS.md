# Export format strategy

The exporter is for screen assets and document pages, not a universal print or app-store delivery pipeline. Export only the targets your project needs.

| Use case | Recommended output | Project status |
| --- | --- | --- |
| Transparent bitmap UI assets | PNG | JSX: iOS 1x/2x/3x; Android five density folders; web 1x/2x |
| Web icons and logos | SVG | JSX; inspect text, clipping, and embedded raster images |
| Photographic web artwork | JPEG or lossy WebP | JPEG in JSX; WebP via optional `cwebp` helper |
| Lossless web bitmap optimization | Lossless WebP | Optional helper from web PNG exports |
| Xcode regular image assets | `.imageset` plus `Contents.json` | Optional Python packaging helper |
| Document pages prefixed `_` or `*` | One multi-page PDF | JSX; not a PDF/X print preset |
| Modern web image optimization | AVIF | Roadmap, not implemented |
| Android simple vector icons | Vector Drawable XML | Roadmap; SVG needs conversion and visual validation |
| iOS vector image assets | Single-scale vector PDF image sets | Roadmap; not the combined PDF workflow |
| App icons, adaptive icons, store screenshots | Platform-specific formats and sizes | Separate workflows; not implemented |

## Scale assumptions

Start with a 1x artboard. Android densities use 1x, 1.5x, 2x, 3x, and 4x. iOS exports include 1x for compatibility and 2x/3x variants. A finished high-resolution screenshot should not automatically be treated as a 1x UI asset. Store screenshot dimensions and icon rules must be checked for the target platform separately.

## Color and quality

Prepare screen artwork in the intended RGB/sRGB workflow. The script warns for CMYK but does not perform full color management or change the source document. A higher export scale cannot restore detail in a low-resolution placed image. Check document raster effects, fonts, shadows, transparency, and embedded/linked images manually.

## WebP versus AVIF

Adobe documents WebP in Illustrator's export UI. This repository currently uses a separate `cwebp` conversion step, not a native JSX WebP export implementation. AVIF is a roadmap item. Neither capability should be advertised as built into the script until implemented and tested.

## Naming

Use artboard names as the filename base. Only generated scale suffixes and Android resource normalization are added. A leading underscore or literal asterisk routes the entire artboard to the combined PDF only. Do not use reserved scale suffixes in source names when packaging Xcode assets.

## Primary references

Reviewed for this preview on 2026-11-03:

- [Adobe: supported Illustrator formats](https://helpx.adobe.com/illustrator/desktop/get-started/learn-the-basics/supported-file-formats-in-illustrator.html)
- [Adobe: export artboards and assets for screens](https://helpx.adobe.com/illustrator/desktop/save-and-export/export-files-to-different-formats/export-artboards-and-assets-for-screens.html)
- [Apple: image set format and Contents.json](https://developer.apple.com/library/archive/documentation/Xcode/Reference/xcode_ref-Asset_Catalog_Format/ImageSetType.html)
- [Android: grids, units, and density factors](https://developer.android.com/design/ui/mobile/guides/layout-and-content/grids-and-units)

UI format support is not a guarantee that a specific ExtendScript export path works in every Illustrator version.
