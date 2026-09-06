# breakword

Get the zero-based index of the character after which a word must be broken so that the portion before the break fits within a given display width. Width is measured with [`wcwidth`](https://www.npmjs.com/package/wcwidth), so wide characters and emoji are accounted for instead of relying on JavaScript's UTF-16 `String.length`.

## Installation

```bash
npm install breakword
```

## Usage

### ES modules / TypeScript

```ts
import breakword from 'breakword'

const word = '打破我的角色三'
const breakIndex = breakword(word, 3)

console.log(breakIndex) // 0
```

### CommonJS

```js
const breakword = require('breakword')

const breakIndex = breakword('打破我的角色三', 3)

console.log(breakIndex) // 0
```

The returned value is a **zero-based Unicode code-point index**. A result of `0` means the break occurs immediately before the character at index `0`; in the example above, only `打` fits within a display width of 3, so the break is before `破`.

The package includes TypeScript declarations, so TypeScript projects get type checking automatically.

The function accepts values that can be converted to strings, including numbers:

```js
breakword(2.1, 1) // 0
```

## Development

The source is written in TypeScript and compiled with the TypeScript compiler. Tests use Node.js's built-in test runner.

```bash
npm test
```

Supported Node.js versions are the current maintained LTS releases beginning with Node.js 22.

## Release

The package ships the compiled JavaScript and TypeScript declarations from `dist/`. `npm publish` runs the test suite before publishing.
