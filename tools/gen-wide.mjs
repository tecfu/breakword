#!/usr/bin/env node
// Regenerate the East Asian Wide/Fullwidth table in src/main.js from Unicode data.
// Dev-only: not published (see "files" in package.json), no runtime dependency.
//
//   node tools/gen-wide.mjs            # fetch latest UCD
//   node tools/gen-wide.mjs path.txt   # use a local EastAsianWidth.txt
//
// Rewrites the block between /* <wide> */ and /* </wide> */ in src/main.js.
// Only W (wide) and F (fullwidth) are needed; everything else is width 1 unless
// it matches the zero-width property regex.

import fs from 'node:fs';
import path from 'node:path';

const SOURCE = 'https://www.unicode.org/Public/UCD/latest/ucd/EastAsianWidth.txt';

async function load(source) {
  if (!/^https?:/i.test(source)) return fs.readFileSync(source, 'utf8');
  const res = await fetch(source);
  if (!res.ok) throw new Error(`${res.status} ${res.url}`);
  return res.text();
}

// @missing lines carry the defaults for unassigned blocks (planes 2 and 3 are
// wide in their entirety) and must be kept.
function parse(text) {
  const ranges = [];
  for (const line of text.split('\n')) {
    const m = line.match(/^(?:@missing:\s*)?([0-9A-Fa-f]{4,6})(?:\.\.([0-9A-Fa-f]{4,6}))?\s*;\s*([WFAHNaN]+)/);
    if (!m || (m[3] !== 'W' && m[3] !== 'F')) continue;
    ranges.push([parseInt(m[1], 16), parseInt(m[2] ?? m[1], 16)]);
  }
  return merge(ranges);
}

function merge(ranges) {
  ranges.sort((a, b) => a[0] - b[0]);
  const out = [];
  for (const [lo, hi] of ranges) {
    const last = out[out.length - 1];
    if (last && lo <= last[1] + 1) last[1] = Math.max(last[1], hi);
    else out.push([lo, hi]);
  }
  return out;
}

const escape = (cp) =>
  cp <= 0xffff
    ? `\\\\u${cp.toString(16).toUpperCase().padStart(4, '0')}`
    : `\\\\u{${cp.toString(16).toUpperCase()}}`;

const text = await load(process.argv[2] ?? SOURCE);
const ranges = merge(parse(text));

const entries = ranges.map(([lo, hi]) => `  '${escape(lo)}${lo === hi ? '' : `-${escape(hi)}`}',`);
const date = text.match(/^# Date:\s*(.+)$/m)?.[1]?.trim() ?? 'unknown';
const block = `/* <wide> */\n// East Asian Width W+F ranges — ${date}\nconst WIDE = new RegExp(\n  '[' + [\n${entries.join('\n')}\n  ].join('') + ']',\n  'u',\n);\n/* </wide> */`;

const file = path.join(import.meta.dirname, '..', 'src', 'main.js');
const src = fs.readFileSync(file, 'utf8');
if (!/\/\* <wide> \*\//.test(src)) throw new Error('markers not found in src/main.js');
fs.writeFileSync(file, src.replace(/\/\* <wide> \*\/[\s\S]*?\/\* <\/wide> \*\//, () => block));

console.log(`src/main.js: ${ranges.length} wide/fullwidth ranges, highest 0x${ranges.at(-1)[1].toString(16).toUpperCase()}`);
