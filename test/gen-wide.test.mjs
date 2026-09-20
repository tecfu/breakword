// The generated table: parser semantics, integrity, and provenance.
//
//   node tools/gen-wide.mjs 18.0.0        # regenerate
//   npm run check:unicode                 # verify src/main.js is reproducible

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

import { parse, merge, render, UNICODE_VERSION } from '../tools/gen-wide.mjs';
import breakword from '../src/main.js';

const { WIDE, WIDE_RANGES } = breakword.internals;
const fixture = fs.readFileSync(new URL('./fixtures/EastAsianWidth.txt', import.meta.url), 'utf8');
const x = (hex) => parseInt(hex, 16);

test('parses a UCD-shaped file', () => {
  assert.deepEqual(parse(fixture), [
    [x('1100'), x('1102')],
    [x('2000'), x('200F')],
    [x('2329'), x('2329')],
    [x('2E80'), x('2E99')],
    [x('2E9B'), x('3633')],
    [x('1F300'), x('1F320')],
  ]);
});

test('successive @missing lines override earlier defaults', () => {
  const text = [
    '# @missing: 0000..10FFFF; N',
    '# @missing: 2000..20FF; W',
    '# @missing: 2080..20FF; N',
  ].join('\n');

  assert.deepEqual(parse(text), [[x('2000'), x('207F')]]);
});

test('explicit data entries override @missing defaults', () => {
  const text = [
    '# @missing: 0000..10FFFF; N',
    '# @missing: 2000..20FF; W',
    '2050..205F ; N',
    '20A0..20AF ; F',
  ].join('\n');

  assert.deepEqual(parse(text), [
    [x('2000'), x('204F')],
    [x('2060'), x('20FF')],
  ]);
});

test('a documented default value is not dropped', () => {
  const only = '# @missing: AC00..D7A3; W\n';
  assert.deepEqual(parse(only), [[x('AC00'), x('D7A3')]]);
});

test('ignored lines stay ignored', () => {
  assert.throws(() => parse(fixture.replace(/; [WF] |; [WF]$/gm, '; N ')), /no W\/F ranges/);
  assert.equal(parse(fixture).some(([lo]) => lo === x('0400')), false, '# 0400..0410 is commented out');
});

test('merge is order independent and joins adjacency', () => {
  assert.deepEqual(merge([[x('C'), x('E')], [x('1'), x('2')], [x('3'), x('5')]]), [[1, x('5')], [x('C'), x('E')]]);
  assert.deepEqual(merge([[x('10'), x('20')], [x('12'), x('14')]]), [[x('10'), x('20')]]);
});

test('the table comes from the pinned Unicode release', () => {
  assert.equal(breakword.internals.UNICODE_VERSION, UNICODE_VERSION);
});

test('ranges are sorted, disjoint and in bounds', () => {
  let previous = -2;
  for (const [lo, hi] of WIDE_RANGES) {
    assert.ok(lo <= hi, `empty range 0x${lo.toString(16)}`);
    assert.ok(lo > previous + 1, `0x${lo.toString(16)} overlaps or should have merged with 0x${previous.toString(16)}`);
    assert.ok(lo >= 0 && hi <= 0x10ffff, 'out of range');
    previous = hi;
  }
});

test('every range is inclusive at both ends', () => {
  const at = (code) => WIDE.test(String.fromCodePoint(code));
  for (const [lo, hi] of WIDE_RANGES) {
    assert.ok(at(lo) && at(hi), `0x${lo.toString(16)}..${hi.toString(16)} endpoints`);
    if (lo > 0) assert.ok(!at(lo - 1), `0x${(lo - 1).toString(16)} leaks in`);
    if (hi < 0x10ffff) assert.ok(!at(hi + 1), `0x${(hi + 1).toString(16)} leaks out`);
  }
});

test('the supplementary CJK blocks are wide, the gaps are not', () => {
  const at = (hex) => WIDE.test(String.fromCodePoint(x(hex)));
  for (const hex of ['20000', '2A6DF', '2F800', '2FFFD', '30000', '3134A', '3FFFD']) {
    assert.ok(at(hex), `${hex} should be wide`);
  }
  for (const hex of ['1FFFF', '2FFFE']) {
    assert.ok(!at(hex), `${hex} should not be wide`);
  }
});

test('render records the Unicode provenance', () => {
  const block = render([[x('1100'), x('1102')]], '9.9.9', '2026-01-01, 00:00:00 GMT');
  assert.match(block, /EastAsianWidth-9\.9\.9\.txt \(2026-01-01, 00:00:00 GMT\)/);
  assert.match(block, /node tools\/gen-wide\.mjs 9\.9\.9/);
  assert.match(block, /^  \[0x1100, 0x1102\],$/m);
});

test('the table is reproducible from the pinned source', { skip: !process.env.CHECK_UNICODE }, () => {
  execFileSync(process.execPath, ['tools/gen-wide.mjs', UNICODE_VERSION, '--check'], {
    cwd: path.join(import.meta.dirname, '..'),
    stdio: 'pipe',
  });
});
