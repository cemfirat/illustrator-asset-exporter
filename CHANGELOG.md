# Changelog

## Unreleased

### Added

- Six native Export for Screens presets derived from the maintainer's exported Adobe preset: Web Essentials, Web Compatible, iOS PNG, Android PNG Scales, SVG Only and PDF Only.
- Native workflow helper: shows asset/PDF ranges and exports marked pages to one PDF from a temporary saved `.ai` copy beside the source.
- Explicit refusal to overwrite an existing helper PDF, and guards against empty PDF ranges.
- Twelve mocked native-helper tests and three native-preset test methods covering all six files.
- English hybrid/native workflow documentation and separate UI-versus-script support matrix.

### Clarified

- Native Illustrator WebP does not need the repository's external converter.
- Presets do not conditionally select artboards, set all application options, or enforce Single File PDF mode.
- The full batch exporter remains available and unchanged.
- Preview status means real Illustrator import/render validation is still outstanding. No release or tag is implied.

## 0.1.0-preview - 2026-11-03

Initial public preview of Illustrator Asset Exporter.

### Included

- English Illustrator ExtendScript interface.
- Original iOS/web artboard filename bases, without automatic `ui_` prefixes.
- PNG densities for iOS and Android; web SVG/PNG and optional JPEG.
- One combined PDF for artboards starting with `_` or literal `*`.
- Preflight checks for duplicate/generated filenames and Android collisions.
- Saved `.ai` source protection, temporary PDF copy, and export report.
- Optional WebP converter and Xcode image-set packaging helper.
- English documentation, contribution guidance, issue templates, and static checks.

### Validation status

JavaScript syntax, mocked preflight, shell syntax, and Python helper tests are available. Real Illustrator/macOS export fidelity is not yet verified. This version label does not imply a published GitHub Release or Git tag.
