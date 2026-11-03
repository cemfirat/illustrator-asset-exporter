# Validation status

## What is checked

The six extensionless preset files are derived from a maintainer-supplied Illustrator export. Repository checks parse their collection structure, suffix byte lengths, scale values and observed format identifiers, and compare the rows against `.github/preset-manifest.json`.

The native files retain their existing bytes and CR line endings. Format identifiers come from the supplied sample; they are not a published cross-version compatibility contract.

**Automated checks do not launch Illustrator, import a preset, render artwork or inspect visual fidelity.** No specific Illustrator/macOS version is recorded as verified yet. The existing example outputs do not establish that these exact six presets generated them.

## Small first-run test

Create a disposable RGB document with `_Cover`, `Logo` and `_Notes`. Make `Logo` exactly 100 x 100 px and leave part of it transparent.

1. Import Web Essentials and verify its five rows: SVG, PNG 1x/2x and WebP 1x/2x.
2. Select only artboard 2. Export to a new folder and check `Logo.svg`, the two PNGs and the two WebP files. Verify the raster dimensions are 100 x 100 and 200 x 200 px, and inspect transparency and colors.
3. Select only artboards 1 and 3, apply PDF Only, and choose Single File. Confirm one PDF with two pages in the intended order.
4. Import each other preset you use and compare its rows with the preset table. Record any changes needed in format settings.

Report the exact Illustrator version, macOS version, preset name, imported rows and observed result through a repository issue. Do not upload private client work, local filesystem paths or font files. A completed test report can then replace the unverified status for that exact environment; it does not certify every version.
