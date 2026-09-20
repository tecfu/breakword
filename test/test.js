'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const breakword = require('..');

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
