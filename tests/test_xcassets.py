import importlib.util
import json
import tempfile
import unittest
from pathlib import Path

MODULE = Path(__file__).resolve().parents[1] / "tools" / "build_xcassets.py"
spec = importlib.util.spec_from_file_location("build_xcassets", MODULE)
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)


class XcodeAssetTest(unittest.TestCase):
    def test_build_imagesets_and_preserve_artboard_names(self):
        with tempfile.TemporaryDirectory() as folder:
            export = Path(folder)
            src = export / "iOS" / "PNG"
            src.mkdir(parents=True)
            for name in ("Home.png", "Home@2x.png", "Home@3x.png",
                         "Login Screen.png", "Login Screen@2x.png", "Login Screen@3x.png"):
                (src / name).write_bytes(b"placeholder for unit test")
            count = mod.build(export)
            self.assertEqual(count, 2)
            imageset = export / "Xcode" / "Assets.xcassets" / "Login Screen.imageset"
            data = json.loads((imageset / "Contents.json").read_text())
            self.assertEqual([a["scale"] for a in data["images"]], ["1x", "2x", "3x"])
            self.assertEqual(data["images"][1]["filename"], "Login Screen@2x.png")
            self.assertTrue((imageset / "Login Screen.png").is_file())

    def test_missing_folder_fails(self):
        with tempfile.TemporaryDirectory() as folder:
            with self.assertRaises(ValueError):
                mod.build(Path(folder))


if __name__ == "__main__":
    unittest.main()
