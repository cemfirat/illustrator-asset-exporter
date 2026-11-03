/* Node mocks only: these tests do not run Illustrator or validate PDF rendering. */
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
const code = fs.readFileSync(path.join(__dirname, '../scripts/Illustrator_Native_Export_Helper.jsx'), 'utf8')
  .replace(/^#target[^\n]*\n/, '')
  .replace('// TEST_HOOK: unit tests expose the pure functions and mocked PDF operation here.',
    'this.testAPI = {partition: partition, rangeText: rangeText, exportMarkedPDF: exportMarkedPDF}; return;');
let passed = 0;
function test(name, fn) { fn(); passed++; console.log('PASS ' + name); }
function fixture(names, settings = {}) {
  const files = {'/design/source.ai': 500}, saved = [], removed = [], closed = [], activated = [];
  function File(filePath) {
    this.fsName = String(filePath); this.name = this.fsName.split('/').pop();
    this.parent = {fsName: this.fsName.slice(0, this.fsName.lastIndexOf('/'))};
    Object.defineProperty(this, 'exists', {get: () => Object.hasOwn(files, this.fsName)});
    Object.defineProperty(this, 'length', {get: () => files[this.fsName] || 0});
    this.copy = destination => {
      if (settings.copyFail) return false;
      assert.ok(!Object.hasOwn(files, destination), 'must not replace a temporary file');
      files[destination] = files[this.fsName]; return true;
    };
    this.remove = () => { removed.push(this.fsName); delete files[this.fsName]; return true; };
  }
  const doc = {
    saved: !settings.unsaved, fullName: new File('/design/source.ai'),
    artboards: names.map(name => ({name})),
    saveAs() { throw new Error('Original must never be saved by the helper'); },
    close() { throw new Error('Original must never be closed'); },
    activate() { activated.push(true); }
  };
  const context = {
    File, PDFSaveOptions: function () {}, PDFCompatibility: {ACROBAT7: 7},
    SaveOptions: {DONOTSAVECHANGES: 0}, app: {
      open(file) {
        assert.equal(file.parent.fsName, '/design', 'copy must preserve relative-link directory');
        if (settings.openOriginal) return doc;
        return {
          artboards: doc.artboards,
          saveAs(target, options) {
            if (settings.saveFail) throw new Error('Simulated save failure');
            saved.push({target: target.fsName, range: options.artboardRange}); files[target.fsName] = 300;
          },
          close() { closed.push(true); }
        };
      }
    }
  };
  vm.runInNewContext(code, context);
  return {api: context.testAPI, doc, files, saved, removed, closed, activated, target: new File('/exports/test.pdf')};
}
function plain(value) { return JSON.parse(JSON.stringify(value)); }
test('underscore and literal star route to PDF, not asset output', () => {
  const f = fixture(['_fonts', 'Logo', '_colors', '*Notes', 'under_score', ' _not_marked']);
  assert.deepEqual(plain(f.api.partition(f.doc.artboards)), {
    assets: [2, 5, 6], pdf: [1, 3, 4], labels: ['1: _fonts', '3: _colors', '4: *Notes']
  });
});
test('screenshot-style first three marked boards give range 4-20', () => {
  const f = fixture(['_fonts', '_colors', '_symbol', ...Array.from({length:17}, (_,i)=>'asset'+i)]);
  const p = f.api.partition(f.doc.artboards);
  assert.equal(f.api.rangeText(p.assets), '4-20'); assert.equal(f.api.rangeText(p.pdf), '1-3');
});
test('non-contiguous ranges retain ordering', () => {
  const f = fixture([]); assert.equal(f.api.rangeText([1, 3, 4, 7, 8, 9]), '1,3-4,7-9');
});
test('empty range is empty, not Select All', () => { assert.equal(fixture([]).api.rangeText([]), ''); });
test('single artboard range', () => { assert.equal(fixture([]).api.rangeText([7]), '7'); });
test('PDF writes only the marked pages from a separate copy', () => {
  const f = fixture(['_Cover', 'Logo', '_Guide']); const result = f.api.exportMarkedPDF(f.doc, f.target);
  assert.equal(result.pages, 2); assert.deepEqual(f.saved, [{target:'/exports/test.pdf',range:'1,3'}]);
  assert.equal(f.closed.length, 1); assert.equal(f.removed.length, 1); assert.equal(f.activated.length, 1);
  assert.equal(f.files['/design/source.ai'], 500);
});
test('no marks cannot fall through to all pages', () => {
  const f = fixture(['Logo']); assert.throws(() => f.api.exportMarkedPDF(f.doc, f.target), /No marked/); assert.equal(f.saved.length, 0);
});
test('unsaved document is rejected before copying', () => {
  const f = fixture(['_Cover'], {unsaved:true}); assert.throws(() => f.api.exportMarkedPDF(f.doc, f.target), /Save the latest/);
  assert.deepEqual(Object.keys(f.files), ['/design/source.ai']);
});
test('existing PDF is never overwritten', () => {
  const f = fixture(['_Cover']); f.files['/exports/test.pdf'] = 111;
  assert.throws(() => f.api.exportMarkedPDF(f.doc, f.target), /already exists/); assert.equal(f.files['/exports/test.pdf'], 111);
});
test('copy failure aborts without saving', () => {
  const f = fixture(['_Cover'], {copyFail:true}); assert.throws(() => f.api.exportMarkedPDF(f.doc, f.target), /Cannot create/); assert.equal(f.saved.length, 0);
});
test('save failure closes copy and restores original', () => {
  const f = fixture(['_Cover'], {saveFail:true}); assert.throws(() => f.api.exportMarkedPDF(f.doc, f.target), /Simulated save failure/);
  assert.equal(f.closed.length, 1); assert.equal(f.removed.length, 1); assert.equal(f.activated.length, 1);
});
test('opening original instead of copy aborts without closing original', () => {
  const f = fixture(['_Cover'], {openOriginal:true}); assert.throws(() => f.api.exportMarkedPDF(f.doc, f.target), /separate copy/);
  assert.equal(f.closed.length, 0); assert.equal(f.saved.length, 0);
});
console.log(passed + ' mocked native-helper tests passed (not Illustrator runtime).');
