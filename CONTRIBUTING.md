# Contributing

Thank you for improving Illustrator Asset Exporter.

## Report a problem

Include the Illustrator and macOS versions, selected export targets, relevant artboard names, expected output, actual output, and a redacted `ExportReport.txt` excerpt. A minimal reproduction is more useful than a large production document.

Do not upload private artwork, employer-owned files, credentials, usernames in local paths, or licensed assets without permission. Review reports before posting them publicly.

## Submit changes

- Keep the JSX compatible with Illustrator's legacy ExtendScript: use ES3-style syntax, not `let`, `const`, arrow functions, template strings, or Node/browser APIs.
- Preserve original iOS/web base names and apply normalization only to Android resource filenames.
- Preserve the `_` / literal `*` PDF-only convention and the saved-source protection.
- Add tests and documentation for behavior changes. Clearly distinguish implemented features, optional helpers, and roadmap items.
- Run all commands in [the testing guide](docs/TESTING.md). Include exact versions for any real Illustrator tests.

Static checks do not replace real Illustrator testing. Keep runtime limitations visible until they have been verified.

## License

By submitting a contribution, you agree that it may be distributed under this repository's MIT license. Only contribute code and assets you have permission to share.
