'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const breakword = require('..');

test('width() returns the width of a single Unicode code point', () => {
  assert.equal(breakword.width('a'), 1);
  assert.equal(breakword.width('打'), 2);
  assert.equal(breakword.width('😀'), 2);
  assert.equal(breakword.width('\u0301'), 0);
  assert.equal(breakword.width('\u200D'), 0);
  assert.equal(breakword.width('\u0000'), 0);
  assert.equal(breakword.width('\u{1F1EB}'), 1);
});

test('width() rejects empty and multi-code-point strings', () => {
  assert.throws(() => breakword.width(''), {
    name: 'TypeError',
    message: 'width() expects exactly one Unicode code point',
  });
  assert.throws(() => breakword.width('ab'), {
    name: 'TypeError',
    message: 'width() expects exactly one Unicode code point',
  });
  assert.throws(() => breakword.width(1), {
    name: 'TypeError',
    message: 'width() expects exactly one Unicode code point',
  });
});

const cases = [
  ['2.0', 1, 0],
  [2.1, 1, 0],
  ['宽字符', 0, 0],
  ['宽字符', 1, 0],
  ['宽字符', 2, 0],
  ['宽字符', 3, 0],
  ['宽字符', 4, 1],
  ['宽ab', 4, 2],
  ['', 10, 0],
  ['😀abc', 2, 0],
  ['😀abc', 3, 1],
  ['e\u0301abc', 1, 1],
  ['a\tb', 3, 2], // control characters are zero-width
  ['x\uFE0Fy', 2, 2], // variation selectors are zero-width
  // widths come from the current Unicode data, not a frozen table
  ['⭐ab', 2, 0], // two-cell emoji that older tables missed
  ['\u{1D54F}\u{1D54F}', 2, 1], // astral yet narrow (East Asian Width = Na)
  ['\u{1F1EB}\u{1F1F7}ab', 3, 2], // regional indicators pair into one flag
];

for (const [input, width, expected] of cases) {
  test(`${JSON.stringify(input)} at width ${width}`, () => {
    assert.equal(breakword(input, width), expected);
  });
}

// Width is scored per code point, so a cluster is charged for its members
// rather than for the one glyph a terminal draws. These are wrong on purpose:
// pinned so that any change to the sequence policy is a decision, not drift.
// See #21 for the grapheme-clustering fix and src/main.js for the trade-off.
const sequences = [
  ['\u2764\uFE0Fab', 2, 2, 'VS16 promotion (❤️) costs nothing, so the row overflows by a cell'],
  ['\u{1F468}\u200D\u{1F469}\u200D\u{1F467}ab', 4, 3, 'ZWJ family (👨‍👩‍👧) charges 6 cells for one glyph'],
  ['1\uFE0F\u20E3ab', 2, 3, 'keycap (1️⃣) charges 1 cell and breaks after the a'],
  ['\u{1F44D}\u{1F3FD}x', 2, 0, 'skin tone modifier (👍🏽) charges a second glyph'],
];

for (const [input, at, expected, why] of sequences) {
  test(`known sequence limitation ${why}`, () => {
    assert.equal(breakword(input, at), expected);
  });
}
