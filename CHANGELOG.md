# Changelog

## 2026-11-03 - Native-only cleanup

- Focus the project on six native Export for Screens presets.
- Remove the full JSX exporter, PDF helper, WebP converter, Xcode packager and their tests from the current branch.
- Replace mixed-workflow documentation with a two-pass native workflow and explicit quality settings.
- Move `Example/` to `examples/`, preserving the Illustrator source and all existing exports unchanged.
- Keep `exports/` plural for output directories; ignore only local root-level `/exports/`.
- Replace script checks with preset-structure validation for repository maintenance.
- Separate recorded validation from unverified Illustrator import/render behavior.

Earlier same-day development included script-based and hybrid previews. Those versions remain in Git history; their instructions no longer describe the current project. This entry does not create a Git tag or GitHub Release.
