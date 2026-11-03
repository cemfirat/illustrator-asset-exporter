"""Validate observed preset structure; not an Illustrator import/runtime test."""
import json
import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

class NativePresetTests(unittest.TestCase):
    def test_profiles_match_manifest_and_preserve_structure(self):
        manifest = json.loads((ROOT / 'presets/manifest.json').read_text())
        for title, expected in manifest['profiles'].items():
            with self.subTest(preset=title):
                raw = (ROOT / 'presets' / title).read_bytes()
                self.assertNotIn(b'\n', raw, 'Preserve the supplied Adobe CR line endings')
                text = raw.decode('ascii').replace('\r', '\n')
                self.assertIn('/CatalogName (' + title + ')', text)
                self.assertIn('/Description (' + title + ')', text)
                self.assertIn('/NumberOfCollections ' + str(len(expected)), text)
                blocks = re.findall(r'/collection(\d+)\s*(\{.*?\n\})(?=\n/collection|\n/Sketch)', text, re.S)
                self.assertEqual(len(blocks), len(expected))
                self.assertEqual([int(n) for n, _ in blocks], list(range(len(expected), 0, -1)))
                outputs = set()
                for number, block in blocks:
                    row = expected[int(number) - 1]
                    suffix = re.search(r'/suffix\s*\[\s*(\d+)\s*([0-9a-fA-F]*)\s*\]', block)
                    decoded = bytes.fromhex(suffix.group(2))
                    self.assertEqual(len(decoded), int(suffix.group(1)))
                    self.assertEqual(decoded.decode('ascii'), row['suffix'])
                    fmt = int(re.search(r'/fileformat (\d+)', block).group(1))
                    self.assertEqual(fmt, row['format_id'])
                    self.assertEqual(float(re.search(r'/scale ([^\n]+)', block).group(1)), row['scale'])
                    self.assertIn('/scaleType 0', block)
                    self.assertIn('/canEdit 1', block)
                    self.assertIn('/canDelete 1', block)
                    key = (fmt, row['suffix'])
                    self.assertNotIn(key, outputs, 'Duplicate filename target')
                    outputs.add(key)
    def test_asset_presets_never_include_pdf_rows(self):
        profiles = json.loads((ROOT / 'presets/manifest.json').read_text())['profiles']
        for title, rows in profiles.items():
            if title != 'PDF Only':
                self.assertNotIn(7, [row['format_id'] for row in rows])
    def test_no_automatic_ui_prefixes(self):
        for title, rows in json.loads((ROOT / 'presets/manifest.json').read_text())['profiles'].items():
            for row in rows:
                self.assertTrue(row['suffix'] == '' or row['suffix'].startswith('@'))

if __name__ == '__main__':
    unittest.main()
