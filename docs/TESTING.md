# Testing

## Automated checks

Run from the repository root:

```bash
for file in scripts/*.jsx; do tail -n +2 "$file" | node --check; done
node tests/test_preflight.js
bash -n tools/convert_webp.sh
python3 -m unittest discover -s tests -v
```

The GitHub Actions workflow runs these same checks. Node only parses the JSX after removing `#target illustrator`; it does not emulate Illustrator or certify ES3 compatibility. Mocked tests exercise preflight decisions. Python tests exercise file copying and image-set metadata using placeholder bytes, not image rendering. Shell syntax checks do not exercise the actual WebP encoder.

## Required manual Illustrator smoke test

Use a disposable copy of artwork without confidential content.

1. Create a saved RGB `.ai` file with artboards named `Home`, `Login Screen`, `_Cover`, `_Guide`, and `*Appendix`.
2. Add visibly distinct artwork to each artboard. Enable all export targets, including optional JPEG.
3. Run `scripts/Illustrator_Asset_Exporter.jsx`.
4. Verify exact iOS/web base names, Android normalization, pixel dimensions, transparency, and JPEG output.
5. Open every SVG in a browser. Confirm each file contains the intended artboard with the correct viewBox, fonts, clipping, and appearance.
6. Open the PDF. It must contain exactly three pages in artboard order, with no `Home` or `Login Screen` page. Marked pages must not appear among the image exports.
7. Verify the original `.ai` was not overwritten and the original active artboard was restored.
8. Check the report and ensure no `__temp_pdf_copy.ai` or `__temp_svg` folder remains.
9. Repeat with PDF disabled and active-artboard-only mode. Disabled PDF output must skip marked artboards.
10. Repeat with linked images, effects, live text, Unicode names, and a document with unsaved changes. PDF output must refuse unsaved source changes.

Test deliberate failures: `Logo` plus `Logo@2x`, `Home` plus `home`, `Login Screen` plus `login_screen`, an invalid filename, and an unwritable destination. No preflight error should silently overwrite files.

For WebP, run the helper with `cwebp` installed and open the resulting files. For Xcode, import the generated image sets into a disposable project and build it. Record the exact Illustrator, macOS, Xcode, and encoder versions used.

**Status:** no real Illustrator/macOS end-to-end validation is recorded yet. Do not infer production readiness from a green static-check workflow.
