// Conformance of the width policy to Unicode property semantics.
// The expectations here are block/property level, so a Unicode-data refresh
// that moves a code point between blocks has to be noticed deliberately.
// Public-API cases live in test/test.js.

import test from 'node:test';
import assert from 'node:assert/strict';

import breakword from '../src/main.js';

const { WIDE, ZERO, EMOJI, width } = breakword.internals;

const UNASSIGNED = /\p{General_Category=Unassigned}/u;
const COMBINING = /[\p{Mn}\p{Me}]/u;
const FORMAT = /\p{Cf}/u;
// Regional indicators have no script of their own (they are Script=Common),
// so the pair that forms one flag glyph is identified by range.
const REGIONAL = (c) => c.codePointAt(0) >= 0x1f1e6 && c.codePointAt(0) <= 0x1f1ff;

const cp = (hex) => String.fromCodePoint(parseInt(hex, 16));

test('width returns a cell count', () => {
  for (let code = 0; code <= 0x10ffff; code++) {
    if (code >= 0xd800 && code <= 0xdfff) continue;
    const w = width(String.fromCodePoint(code));
    assert.ok(w === 0 || w === 1 || w === 2, `U+${code.toString(16)} -> ${w}`);
  }
});

// Every rule is checked against the same property the implementation reads,
// over the whole code point range, so the table cannot quietly override one.
test('zero-width takes precedence over the wide table', () => {
  for (let code = 0; code <= 0x10ffff; code++) {
    if (code >= 0xd800 && code <= 0xdfff) continue;
    const char = String.fromCodePoint(code);
    if ((COMBINING.test(char) || FORMAT.test(char) || ZERO.test(char)) && code !== 0xad) {
      assert.equal(width(char), 0, `U+${code.toString(16).toUpperCase()}`);
    }
    if (EMOJI.test(char) && !REGIONAL(char)) {
      assert.equal(width(char), 2, `U+${code.toString(16).toUpperCase()}`);
    }
  }
});

// name, code point, expected cells
const cases = [
  ['wide CJK', '4E00', 2],
  ['wide CJK last', '9FFF', 2],
  ['wide Hangul syllable', 'AC00', 2],
  ['wide Hangul syllable last', 'D7A3', 2],
  ['wide Hangul Jamo initial', '1100', 2],
  ['fullwidth form', 'FF01', 2],
  ['fullwidth form last', 'FF60', 2],
  ['ideographic space', '3000', 2],
  ['CJK symbol', '2E80', 2],
  ['CJK compat form', 'FE30', 2],
  ['fullwidth sign', 'FFE0', 2],
  ['CJK ext B (supplementary)', '20000', 2],
  ['CJK ext B last', '2A6DF', 2],
  ['CJK compat supplement', '2F800', 2],
  ['CJK ext G (tertiary plane)', '30000', 2],
  ['narrow ASCII', '0041', 1],
  ['narrow Latin-1', '00E9', 1],
  ['ambiguous inverted exclamation', '00A1', 1],
  ['ambiguous Thai', '0E01', 1],
  ['private use BMP', 'E000', 1],
  ['private use end', 'F8FF', 1],
  ['astral non-CJK Deseret', '10400', 1],
  ['astral non-CJK musical', '1D11E', 1],
  ['astral non-CJK math', '1D54F', 1],
  ['unassigned BMP', '0FFF', 1],
  ['unassigned above the SMP', '1FFFF', 1],
  ['gap between the CJK planes', '2FFFE', 1],
  ['unassigned inside a reserved wide block', '2A6E0', 2],
  ['reserved tertiary plane end', '3FFFD', 2],
  ['combining acute', '0301', 0],
  ['combining devanagari', '093C', 0],
  ['enclosing mark', '0489', 0],
  ['enclosing circle', '20DD', 0],
  ['variation selector 1', 'FE00', 0],
  ['variation selector 17', 'E0100', 0],
  ['zero width joiner', '200D', 0],
  ['arabic letter mark', '061C', 0],
  ['right-to-left mark', '200E', 0],
  ['zero width space', '200B', 0],
  ['hangul jamo medial vowel', '1161', 0],
  ['hangul jamo final', '11A8', 0],
  ['C0 control', '0001', 0],
  ['delete', '007F', 0],
  ['C1 control', '009F', 0],
  ['soft hyphen', '00AD', 1],
  ['space', '0020', 1],
  ['emoji presentation', '1F600', 2],
  ['emoji presentation white circle', '2B50', 2],
  ['regional indicator', '1F1E6', 1],
];

for (const [name, hex, expected] of cases) {
  test(`${name} U+${hex} is ${expected}`, () => {
    assert.equal(width(cp(hex)), expected);
  });
}

test('a regional indicator pair sums to one two-cell flag', () => {
  assert.equal([...cp('1F1E7') + cp('1F1F7')].reduce((s, c) => s + width(c), 0), 2);
});

test('emoji presentation is a two-cell override of a narrow table', () => {
  // U+2B50 is in the generated table, and is Emoji_Presentation; a naive
  // table-only implementation would still be right, so pin the pair that
  // would break if EMOJI were dropped or reordered.
  assert.equal(width(cp('2B50')), 2);
  assert.equal(width(cp('1F600')), 2);
  assert.equal(width(cp('1F1E6')), 1, 'regional indicators are the exception');
});
