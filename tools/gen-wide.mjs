#!/usr/bin/env node
// Regenerates the East Asian Wide/Fullwidth table in src/main.js from a pinned
// Unicode release. Development-only: not published (see "files" in
// package.json) and not loaded at runtime.
//
//   node tools/gen-wide.mjs                 # pin to UNICODE_VERSION
//   node tools/gen-wide.mjs 17.0.0          # a specific Unicode release
//   node tools/gen-wide.mjs path/to/EastAsianWidth.txt
//   node tools/gen-wide.mjs --check         # verify src/main.js is reproducible
//
// Rewrites the block between /* <wide> */ and /* </wide> */. Only W (wide) and
// F (fullwidth) are needed: everything the file classifies as N, Na, A or H is
// width 1, and the zero-width rules live in src/main.js as property escapes.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Bump deliberately, together with the table and the conformance suite.
export const UNICODE_VERSION = '18.0.0';

const url = (version) => `https://www.unicode.org/Public/${version}/ucd/EastAsianWidth.txt`;

async function load(source) {
  if (!/^\d+\.\d+\.\d+$/.test(source)) return fs.readFileSync(source, 'utf8');
  const res = await fetch(url(source));
  if (!res.ok) throw new Error(`${res.status} ${res.url}`);
  return res.text();
}

// A UCD line is `start..end ; Value` or `start ; Value`. Properties files also
// document the value used for every code point they do not list with a
// `# @missing: start..end; Value` comment, and those defaults carry real
// weight — a default of W would otherwise silently disappear from the table.
// EastAsianWidth ships exactly one, `# @missing: 0000..10FFFF; N`, so the
// output has no @missing-derived ranges today; the branch is what keeps that
// from changing silently.
export function parse(text) {
  const ranges = [];
  for (const line of text.split('\n')) {
    // Comment lines are inert, except the ones documenting a default value.
    if (!line.includes('@missing') && line.trimStart().startsWith('#')) continue;
    const m = line.match(/^(?:#\s*@missing:\s*|@missing:\s*)?([0-9A-Fa-f]{4,6})(?:\.\.([0-9A-Fa-f]{4,6}))?\s*;\s*([WFAHNaN]+)(?=\s|#|$)/);
    if (!m || (m[3] !== 'W' && m[3] !== 'F')) continue;
    ranges.push([parseInt(m[1], 16), parseInt(m[2] ?? m[1], 16)]);
  }
  const merged = merge(ranges);
  if (merged.length === 0) throw new Error('no W/F ranges parsed — is this EastAsianWidth.txt?');
  return merged;
}

export function merge(ranges) {
  const sorted = [...ranges].sort((a, b) => a[0] - b[0]);
  const out = [];
  for (const [lo, hi] of sorted) {
    const last = out.at(-1);
    if (last && lo <= last[1] + 1) last[1] = Math.max(last[1], hi);
    else out.push([lo, hi]);
  }
  return out;
}

const hex = (cp) => `0x${cp.toString(16).toUpperCase()}`;

export function render(ranges, version, date) {
  const entries = ranges.map(([lo, hi]) => `  [${hex(lo)}, ${hex(hi)}],`);
  return [
    '/* <wide> */',
    `// East Asian Width W + F — EastAsianWidth-${version}.txt (${date})`,
    `// Regenerate: node tools/gen-wide.mjs ${version}`,
    `const UNICODE_VERSION = '${version}';`,
    'const WIDE_RANGES = [',
    ...entries,
    '];',
    '/* </wide> */',
  ].join('\n');
}

// Guarded so `import { parse } from '../tools/gen-wide.mjs'` in a test does
// not fetch Unicode over the network and rewrite src/main.js.
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const check = args.includes('--check');
  const source = args.find((a) => a !== '--check') ?? UNICODE_VERSION;

  const text = await load(source);
  const version = text.match(/^#\s*EastAsianWidth-([\d.]+)\.txt/m)?.[1] ?? source;
  const date = text.match(/^#\s*Date:\s*(.+)$/m)?.[1]?.trim() ?? 'unknown';
  const ranges = parse(text);
  const block = render(ranges, version, date);

  const file = path.join(import.meta.dirname, '..', 'src', 'main.js');
  const src = fs.readFileSync(file, 'utf8');
  const marker = /\/\* <wide> \*\/[\s\S]*?\/\* <\/wide> \*\//;
  if (!marker.test(src)) throw new Error('markers not found in src/main.js');

  if (check) {
    if (src.match(marker)[0] === block) {
      console.log(`reproducible: ${ranges.length} ranges from EastAsianWidth-${version}.txt`);
    } else {
      console.error(`STALE: src/main.js is not what EastAsianWidth-${version}.txt produces`);
      process.exitCode = 1;
    }
  } else {
    fs.writeFileSync(file, src.replace(marker, () => block));
    console.log(`src/main.js: Unicode ${version}, ${ranges.length} wide/fullwidth ranges`);
  }
}
