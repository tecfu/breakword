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
];

for (const [input, width, expected] of cases) {
  test(`${JSON.stringify(input)} at width ${width}`, () => {
    assert.equal(breakword(input, width), expected);
  });
}
