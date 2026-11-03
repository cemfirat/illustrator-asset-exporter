# Presets-only download

[Download illustrator-native-export-presets.zip](illustrator-native-export-presets.zip?raw=1)

This small package contains only the six native preset files, [START_HERE.md](START_HERE.md) and the MIT license. It excludes example artwork, export scripts, converters and developer tooling. Extract it before importing a preset in Illustrator.

The ZIP contains the same preset bytes as [presets/](../presets/README.md). Its SHA-256 digest is recorded in [SHA256SUMS](SHA256SUMS); repository checks compare every packaged file with its source. This verifies integrity and consistency, not Illustrator compatibility or a digital signature.

For the source example and full documentation, use the repository's **Code > Download ZIP** instead. The package here is a snapshot of the current repository contents, not a separately published GitHub Release.

Maintainers: rebuild the package whenever a preset, START_HERE.md or LICENSE changes, and update SHA256SUMS. The workflow rejects stale or unexpected package contents. Keep native preset bytes and line endings unchanged.
