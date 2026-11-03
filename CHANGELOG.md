# Changelog

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
