#!/usr/bin/env python3
"""Generate Xcode .imageset folders and Contents.json from Illustrator's iOS/PNG export.

Only standard raster image sets are handled; app icons, dark/light variants,
PDF vector images, marketing screenshots, and device-specific assets are separate.
Python 3 standard library only; no third-party dependencies.
"""
import argparse
import json
import shutil
import sys
from pathlib import Path
from typing import Optional

SCALES = ("1x", "2x", "3x")


def build(export_root: Path, output: Optional[Path] = None) -> int:
    src = export_root / "iOS" / "PNG"
    if not src.is_dir():
        raise ValueError(f"iOS/PNG folder not found below: {export_root}")
    output = output or export_root / "Xcode" / "Assets.xcassets"
    sources = sorted(src.glob("*.png"), key=lambda p: p.name.casefold())
    if not sources:
        raise ValueError(f"No PNG files in {src}")
    # The base 'Name.png' anchors each image set. That prevents orphan @2x files
    # from being silently promoted to assets with the wrong names.
    singles = [p for p in sources if not p.stem.endswith(("@2x", "@3x"))]
    if not singles:
        raise ValueError("No 1x base PNG assets found; cannot determine source names")
    stems = {p.stem.casefold() for p in singles}
    if len(stems) != len(singles):
        raise ValueError("Duplicate base asset names differing only by case")
    created = 0
    for base in singles:
        stem = base.stem
        # Avoid reserved suffixes in names to prevent ambiguous scale grouping.
        if stem.endswith(("@1x", "@2x", "@3x")):
            raise ValueError(f"Reserved scale suffix in source artboard name: {stem}")
        images = []
        paths = (base, src / (stem + "@2x.png"), src / (stem + "@3x.png"))
        folder = output / (stem + ".imageset")
        folder.mkdir(parents=True, exist_ok=True)
        for scale, path in zip(SCALES, paths):
            if not path.is_file():
                print(f"Warning: missing {scale} image for {stem}: {path.name}", file=sys.stderr)
                continue
            shutil.copy2(path, folder / path.name)
            images.append({"filename": path.name, "idiom": "universal", "scale": scale})
        content = {"images": images, "info": {"author": "xcode", "version": 1}}
        (folder / "Contents.json").write_text(
            json.dumps(content, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
        )
        created += 1
    # Detect unassociated scale files, e.g., if their 1x base was renamed/removed.
    for path in sources:
        stem = path.stem
        for suffix in ("@2x", "@3x"):
            if stem.endswith(suffix):
                if stem[:-len(suffix)].casefold() not in stems:
                    print(f"Warning: orphan scaled PNG skipped: {path.name}", file=sys.stderr)
                break
    print(f"Created {created} Xcode .imageset folder(s) in {output}")
    return created


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("export_root", type=Path, help="Illustrator export folder containing iOS/PNG")
    parser.add_argument("--output", type=Path, default=None, help="Destination .xcassets directory")
    args = parser.parse_args()
    try:
        build(args.export_root, args.output)
    except (OSError, ValueError) as exc:
        parser.exit(1, f"Error: {exc}\n")


if __name__ == "__main__":
    main()
