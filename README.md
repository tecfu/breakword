# breakword

Get the zero-based index of the character after which a word must be broken so that the portion before the break fits within a given display width. Width is measured in terminal cells rather than in JavaScript's UTF-16 `String.length`, so wide characters and emoji are accounted for.

Zero dependencies: the wide/fullwidth ranges ship inlined in the source, so there is nothing to install and nothing to audit.

## Display width is a policy

There is no universal answer. UAX #11, which defines East Asian Width, describes it as a hint that implementations are expected to tailor, so this module states what it assumes:

| cells | |
|---|---|
| 2 | East Asian Width `W` or `F`, plus emoji that UAX #51 gives the emoji presentation by default (`⭐`, `😀`) |
| 1 | everything else, including `A` (ambiguous) and the astral plane's non-CJK blocks (`𝕏`, Deseret, musical symbols), which are `Na` |
| 0 | combining marks, format characters, C0/C1 controls |

Two consequences worth knowing before you depend on it. Ambiguous characters (`U+00A1`, Thai, Greek and others) count as 1, which is right for a Western locale and one cell short of what a CJK locale renders. And a regional indicator counts as 1 on its own, so a pair — the way a flag is encoded — sums to the 2 cells one flag glyph occupies.

The per-code-point model also cannot see clusters, so a ZWJ sequence (`👨‍👩‍👧`) is charged for each member and a base promoted by `U+FE0F` (`❤️`) stays at 1. Those are pinned by the regressions in `test/test.js`; grapheme-aware measurement is tracked in [#21](https://github.com/tecfu/breakword/issues/21).

## Installation

```bash
npm install breakword
```

## Usage

```js
const breakword = require('breakword');

const word = '打破我的角色三';
const breakIndex = breakword(word, 3);

console.log(breakIndex); // 0
```

The returned value is a **zero-based Unicode code-point index**. A result of `0` means the break occurs immediately before the character at index `0`; in the example above, only `打` fits within a display width of 3, so the break is before `破`.

The function accepts values that can be converted to strings, including numbers:

```js
breakword(2.1, 1); // 0
```

`breakword.width(char)` returns the display width (0, 1 or 2 terminal cells) of a single code point, for consumers that measure text themselves:

```js
const width = (str) => [...str].reduce((n, c) => n + breakword.width(c), 0);
width('打破a\u200d'); // 5
```

## Development

Tests use Node.js's built-in test runner, so no test framework or build step is required.

```bash
npm test
```

Supported Node.js versions are the current maintained LTS releases beginning with Node.js 22.

`test/` is split by what it trusts: `test.js` exercises the public API, `unicode.test.mjs` checks the width rules against Unicode properties over the whole code point range, and `gen-wide.test.mjs` checks the generated table's integrity against a fixture. Nothing in the suite reaches the network.

### The Unicode table

`src/main.js` carries the `W`/`F` ranges from one pinned Unicode release, recorded in the generated block. The generator is pinned so a review can reproduce the table exactly:

```bash
npm run regen:unicode              # tools/gen-wide.mjs, pinned release
npm run check:unicode              # fail if src/main.js is not reproducible
node tools/gen-wide.mjs 17.0.0     # a specific release
node tools/gen-wide.mjs --check    # same as the npm script
```

Regenerating is a deliberate act: it can move break indices, so the table, the pinned version and the expectations in `test/unicode.test.mjs` move together, and the release is a major version. CI runs `check:unicode` so a stale table fails the build rather than sitting in the source.

## Release

The package ships the source module directly. `npm publish` runs the test suite before publishing.
