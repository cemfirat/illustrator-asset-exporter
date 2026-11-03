# Examples

This directory contains the maintainer-supplied Illustrator source and its existing exported files.

```text
examples/
  Logo & Assets.ai
  exports/
    JPG/
    PDF/
    PNG/
    SVG/
    WebP/
    favicons/
```

[Illustrator source](Logo%20%26%20Assets.ai) - [Existing exports](exports/)

## Why these names?

**examples/** describes the purpose of the material. **exports/** describes the generated output files. Both are lowercase and plural. This is a project convention, not an Illustrator requirement. The original source filename and Illustrator-generated format folder names are kept unchanged.

The directory was moved from `Example/` to `examples/`. The `.ai` file and the entire `exports/` subtree were preserved byte-for-byte; nothing was re-rendered, renamed inside the export tree or deleted.

## What the outputs demonstrate

These are existing reference outputs, not a golden test suite for the six presets. They include additional sizes, JPEGs and a favicon folder outside the current preset set. Their presence does not mean Web Essentials creates all of them, or that every current preset has passed an Illustrator import test.

To try the workflow, open a copy of the source and export to a new folder outside this directory. Do not overwrite the supplied references. For new examples, record the exact Illustrator/macOS version, preset, selected artboards and important format settings.

Before reusing or redistributing artwork, confirm the relevant artwork, trademark and font permissions. No font files are supplied by this project, and the software license does not grant third-party trademark or font rights.
