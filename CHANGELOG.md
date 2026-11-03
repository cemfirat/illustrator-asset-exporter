# Changelog

## 2026-11-03 - Distribution and validation audit

- Add a small presets-only ZIP with a standalone English quick-start guide and SHA-256 checksum.
- Link the download directly from the README; keep examples out of the package.
- Add exact expected filenames and dimensions for all six presets and a native compatibility-report template.
- Extend repository checks to package integrity, internal Markdown links and native-only repository hygiene.
- Remove the one-byte Icon? placeholder from examples and ignore desktop metadata; retain source artwork and actual exports unchanged.
- Keep all six native preset files and the MIT license byte-for-byte unchanged.
- Confirm that repository Description and Topics describe the native-only workflow.

Illustrator import/render validation remains unrecorded. This is a repository update, not a certified release.

## 2026-11-03 - Native-only cleanup

- Focus the project on six native Export for Screens presets.
- Remove the full JSX exporter, PDF helper, WebP converter, Xcode packager and their tests from the current branch.
- Replace mixed-workflow documentation with a two-pass native workflow and explicit quality settings.
- Move `Example/` to `examples/`, preserving the Illustrator source and all existing exports unchanged.
- Keep `exports/` plural for output directories; ignore only local root-level `/exports/`.
- Replace script checks with preset-structure validation for repository maintenance.
- Separate recorded validation from unverified Illustrator import/render behavior.

Earlier same-day development included script-based and hybrid previews. Those versions remain in Git history; their instructions no longer describe the current project. This entry does not create a Git tag or GitHub Release.
