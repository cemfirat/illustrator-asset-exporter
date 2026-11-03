/* Mocked preflight only: this does not run Adobe Illustrator. */
const fs = require('fs');
const vm = require('vm');
const path = require('path');
const assert = require('assert');
const file = path.join(__dirname, '..', 'scripts', 'Illustrator_Asset_Exporter.jsx');
const source = fs.readFileSync(file, 'utf8').replace(/^#target illustrator\r?\n/, '');

function preflight(names, options = {}) {
  const alerts = [];
  let destinationPrompts = 0;
  const boards = names.map(name => ({ name }));
  boards.getActiveArtboardIndex = () => options.active || 0;
  const doc = {
    name: 'Demo.ai', saved: options.saved !== false, artboards: boards,
    fullName: { exists: true, name: 'Demo.ai' },
  };
  const app = { activeDocument: doc, documents: options.noDocument ? [] : [doc] };
  function UI(kind, _unused, value) {
    return {
      text: kind === 'edittext' ? value : '',
      add(childKind, b, childValue) {
        const child = UI(childKind, b, childValue);
        if (childKind === 'checkbox') {
          let current = false;
          Object.defineProperty(child, 'value', {
            get() {
              if (childValue.indexOf("Artboards starting") === 0 && options.pdf === false) return false;
              if (childValue.indexOf('Only process') === 0 && options.onlyActive) return true;
              return current;
            },
            set(v) { current = v; },
          });
        }
        return child;
      },
      show: () => 1,
    };
  }
  vm.runInNewContext(source, {
    app, Window: UI, alert: msg => alerts.push(msg),
    Folder: { selectDialog: () => { destinationPrompts++; return null; } },
    DocumentColorSpace: { CMYK: 'CMYK' },
  });
  return { text: alerts.join('\n'), destinationPrompts };
}

let count = 0;
function test(name, fn) { fn(); count++; console.log('PASS:', name); }
test('no open document', () => {
  assert.match(preflight([], { noDocument: true }).text, /Open an Illustrator document/);
});
test('no artboards', () => {
  assert.match(preflight([]).text, /no artboards/);
});
test('generated scale collision', () => {
  const result = preflight(['Logo', 'Logo@2x']);
  assert.match(result.text, /Filename collision/);
  assert.match(result.text, /Logo@2x\.png/);
  assert.strictEqual(result.destinationPrompts, 0);
});
test('case-insensitive duplicate', () => {
  assert.match(preflight(['Home', 'home']).text, /Duplicate artboard name/);
});
test('Android resource collision', () => {
  assert.match(preflight(['Login Screen', 'login_screen']).text, /Android resource name collision/);
});
test('invalid filename', () => {
  assert.match(preflight(['Login/Screen']).text, /Invalid or overly long filename/);
});
test('unsaved PDF source rejected', () => {
  assert.match(preflight(['Home', '_Guide', '*Appendix'], { saved: false }).text, /PDF safety check/);
});
test('valid names can proceed to destination selection', () => {
  const result = preflight(['Home', 'Login Screen', '\u00dcberblick', '_Guide', '*Appendix']);
  assert.strictEqual(result.text, '');
  assert.strictEqual(result.destinationPrompts, 1);
});
test('raster-only export does not require saved AI', () => {
  assert.strictEqual(preflight(['Home'], { saved: false }).destinationPrompts, 1);
});
test('disabled PDF skips marked pages instead of exporting assets', () => {
  const result = preflight(['_Guide', '*Appendix'], { pdf: false, saved: false });
  assert.match(result.text, /No matching artboards/);
  assert.strictEqual(result.destinationPrompts, 0);
});
test('active-only mode ignores unrelated name collisions', () => {
  const result = preflight(['Logo', 'Logo@2x'], { onlyActive: true });
  assert.strictEqual(result.text, '');
  assert.strictEqual(result.destinationPrompts, 1);
});
test('original document is not the PDF saveAs target', () => {
  assert(!/\bdoc\.saveAs\s*\(/.test(source));
  assert(/\bclone\.saveAs\s*\(/.test(source));
});
console.log(`${count} mocked/static preflight checks passed; Illustrator rendering was not tested.`);
