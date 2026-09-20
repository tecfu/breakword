#!/usr/bin/env node
// Regenerates the East Asian Wide/Fullwidth table in src/main.ts from a pinned
// Unicode release. Development-only: not published (see "files" in
// package.json) and not loaded at runtime.
//
//   node tools/gen-wide.mjs                 # pin to UNICODE_VERSION
//   node tools/gen-wide.mjs 17.0.0          # a specific Unicode release
//   node tools/gen-wide.mjs path/to/EastAsianWidth.txt
//   node tools/gen-wide.mjs --check         # verify src/main.ts is reproducible
//
// Rewrites the block between /* <wide> */ and /* </wide> */. Only W (wide) and
// F (fullwidth) are needed: everything the file classifies as N, Na, A or H is
// width 1, and the zero-width rules live in src/main.ts as property escapes.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const UNICODE_VERSION = '18.0.0';

const url = (version) => `https://www.unicode.org/Public/${version}/ucd/EastAsianWidth.txt`;

async function load(source) {
  if (!/^\d+\.\d+\.\d+$/.test(source)) return fs.readFileSync(source, 'utf8');
  const res = await fetch(url(source));
  if (!res.ok) throw new Error(`${res.status} ${res.url}`);
  return res.text();
}

const VALUE = new Map([
  ['N', false],
  ['Na', false],
  ['A', false],
  ['H', false],
  ['W', true],
  ['F', true],
]);

const CODE_POINT_RANGE = /^(?:([0-9A-Fa-f]{4,6})(?:\.\.([0-9A-Fa-f]{4,6}))?)\s*;\s*([A-Za-z]+)(?=\s|#|$)/;

// UAX #44 permits multiple @missing lines for a property. Each successive
// @missing line overrides the previous default for its range. Explicit data
// entries then override all @missing defaults for code points they list.
//
// We keep the complete width state in a byte array while parsing. This makes
// the precedence rules explicit and avoids trying to reconstruct arbitrary
// overlapping interval assignments after the fact. The Unicode code point
// space is only 1.1 MiB, and this is a development-time generator.
export function parse(text) {
  const wide = new Uint8Array(0x110000);
  const missing = [];
  const explicit = [];

  for (const rawLine of text.split('\n')) {
    const line = rawLine.trim();

    if (line.startsWith('# @missing:')) {
      const m = line.match(/^#\s*@missing:\s*(.*)$/);
      const parsed = m?.[1].match(CODE_POINT_RANGE);
      if (!parsed) continue;

      const [_, lo, hi, value] = parsed;
      if (!VALUE.has(value)) continue;
      missing.push([
        parseInt(lo, 16),
        parseInt(hi ?? lo, 16),
        VALUE.get(value),
      ]);
      continue;
    }

    if (!line || line.startsWith('#')) continue;

    const m = line.match(CODE_POINT_RANGE);
    if (!m) continue;

    const [_, lo, hi, value] = m;
    if (!VALUE.has(value)) continue;
    explicit.push([
      parseInt(lo, 16),
      parseInt(hi ?? lo, 16),
      VALUE.get(value),
    ]);
  }

  for (const [lo, hi, isWide] of missing) {
    wide.fill(isWide ? 1 : 0, lo, hi + 1);
  }

  for (const [lo, hi, isWide] of explicit) {
    wide.fill(isWide ? 1 : 0, lo, hi + 1);
  }

  const ranges = [];
  let start = -1;

  for (let code = 0; code <= 0x10ffff; code += 1) {
    if (wide[code] && start < 0) {
      start = code;
    } else if (!wide[code] && start >= 0) {
      ranges.push([start, code - 1]);
      start = -1;
    }
  }

  if (start >= 0) ranges.push([start, 0x10ffff]);

  if (ranges.length === 0) throw new Error('no W/F ranges parsed — is this EastAsianWidth.txt?');
  return ranges;
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
  if (!marker.test(src)) throw new Error('markers not found in src/main.ts');

  if (check) {
    if (src.match(marker)[0] === block) {
      console.log(`reproducible: ${ranges.length} ranges from EastAsianWidth-${version}.txt`);
    } else {
      console.error(`STALE: src/main.ts is not what EastAsianWidth-${version}.txt produces`);
      process.exitCode = 1;
    }
  } else {
    fs.writeFileSync(file, src.replace(marker, () => block));
    console.log(`src/main.ts: Unicode ${version}, ${ranges.length} wide/fullwidth ranges`);
  }
}
