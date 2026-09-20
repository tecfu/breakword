'use strict';

// Which code points occupy two terminal cells. A policy decision, not a
// Unicode fact: UAX #11 defines East Asian Width as a *hint* that is expected
// to be tailored per environment, so this module states its own rules —
//
//   2  East Asian Width W or F (generated table below), plus emoji that
//      Unicode Standard Annex #51 gives the emoji presentation by default
//   0  non-spacing and enclosing marks, format characters, C0/C1 controls
//   1  everything else, including A (ambiguous) and the astral plane's
//      non-CJK blocks, which are East Asian Width Na
//
// A consumer that pads a fixed-width column against a specific terminal may
// want A rendered as 2 (CJK locale) or emoji as 1 (a narrow font). That is a
// different policy, not a bug in this one.

/* <wide> */
// East Asian Width W + F — EastAsianWidth-18.0.0.txt (2026-06-29, 15:25:05 GMT)
// Regenerate: node tools/gen-wide.mjs 18.0.0
const UNICODE_VERSION = '18.0.0';
const WIDE_RANGES: Array<[number, number]> = [
  [0x1100, 0x115F],
  [0x231A, 0x231B],
  [0x2329, 0x232A],
  [0x23E9, 0x23EC],
  [0x23F0, 0x23F0],
  [0x23F3, 0x23F3],
  [0x25FD, 0x25FE],
  [0x2614, 0x2615],
  [0x2630, 0x2637],
  [0x2648, 0x2653],
  [0x267F, 0x267F],
  [0x268A, 0x268F],
  [0x2693, 0x2693],
  [0x26A1, 0x26A1],
  [0x26AA, 0x26AB],
  [0x26BD, 0x26BE],
  [0x26C4, 0x26C5],
  [0x26CE, 0x26CE],
  [0x26D4, 0x26D4],
  [0x26EA, 0x26EA],
  [0x26F2, 0x26F3],
  [0x26F5, 0x26F5],
  [0x26FA, 0x26FA],
  [0x26FD, 0x26FD],
  [0x2705, 0x2705],
  [0x270A, 0x270B],
  [0x2728, 0x2728],
  [0x274C, 0x274C],
  [0x274E, 0x274E],
  [0x2753, 0x2755],
  [0x2757, 0x2757],
  [0x2795, 0x2797],
  [0x27B0, 0x27B0],
  [0x27BF, 0x27BF],
  [0x2B1B, 0x2B1C],
  [0x2B50, 0x2B50],
  [0x2B55, 0x2B55],
  [0x2E80, 0x2E99],
  [0x2E9B, 0x2EF3],
  [0x2F00, 0x2FD5],
  [0x2FF0, 0x303E],
  [0x3041, 0x3096],
  [0x3099, 0x30FF],
  [0x3105, 0x312F],
  [0x3131, 0x318E],
  [0x3190, 0x31E5],
  [0x31EF, 0x321E],
  [0x3220, 0x3247],
  [0x3250, 0xA48C],
  [0xA490, 0xA4C6],
  [0xA960, 0xA97C],
  [0xAC00, 0xD7A3],
  [0xF900, 0xFAFF],
  [0xFE10, 0xFE19],
  [0xFE30, 0xFE52],
  [0xFE54, 0xFE66],
  [0xFE68, 0xFE6B],
  [0xFF01, 0xFF60],
  [0xFFE0, 0xFFE6],
  [0x16FE0, 0x16FE4],
  [0x16FF0, 0x16FF6],
  [0x17000, 0x18CDA],
  [0x18CFF, 0x18D20],
  [0x18D80, 0x18DF2],
  [0x18E00, 0x19191],
  [0x191A0, 0x191D2],
  [0x1AFF0, 0x1AFF3],
  [0x1AFF5, 0x1AFFB],
  [0x1AFFD, 0x1AFFE],
  [0x1B000, 0x1B128],
  [0x1B132, 0x1B132],
  [0x1B150, 0x1B152],
  [0x1B155, 0x1B155],
  [0x1B164, 0x1B168],
  [0x1B170, 0x1B2FB],
  [0x1D300, 0x1D356],
  [0x1D360, 0x1D376],
  [0x1F004, 0x1F004],
  [0x1F0CF, 0x1F0CF],
  [0x1F18E, 0x1F18E],
  [0x1F191, 0x1F19A],
  [0x1F1AE, 0x1F1AE],
  [0x1F200, 0x1F202],
  [0x1F210, 0x1F23B],
  [0x1F240, 0x1F248],
  [0x1F250, 0x1F251],
  [0x1F260, 0x1F265],
  [0x1F300, 0x1F320],
  [0x1F32D, 0x1F335],
  [0x1F337, 0x1F37C],
  [0x1F37E, 0x1F393],
  [0x1F3A0, 0x1F3CA],
  [0x1F3CF, 0x1F3D3],
  [0x1F3E0, 0x1F3F0],
  [0x1F3F4, 0x1F3F4],
  [0x1F3F8, 0x1F43E],
  [0x1F440, 0x1F440],
  [0x1F442, 0x1F4FC],
  [0x1F4FF, 0x1F53D],
  [0x1F54B, 0x1F54E],
  [0x1F550, 0x1F567],
  [0x1F57A, 0x1F57A],
  [0x1F595, 0x1F596],
  [0x1F5A4, 0x1F5A4],
  [0x1F5FB, 0x1F64F],
  [0x1F680, 0x1F6C5],
  [0x1F6CC, 0x1F6CC],
  [0x1F6D0, 0x1F6D2],
  [0x1F6D5, 0x1F6D9],
  [0x1F6DC, 0x1F6DF],
  [0x1F6EB, 0x1F6EC],
  [0x1F6F4, 0x1F6FC],
  [0x1F7DA, 0x1F7DA],
  [0x1F7E0, 0x1F7EB],
  [0x1F7F0, 0x1F7F0],
  [0x1F90C, 0x1F93A],
  [0x1F93C, 0x1F945],
  [0x1F947, 0x1F9FF],
  [0x1FA70, 0x1FA7C],
  [0x1FA80, 0x1FAC6],
  [0x1FAC8, 0x1FAC8],
  [0x1FACC, 0x1FADD],
  [0x1FADF, 0x1FAEB],
  [0x1FAEF, 0x1FAFA],
  [0x20000, 0x2FFFD],
  [0x30000, 0x3FFFD],
];
/* </wide> */

const cell = (cp: number) => (cp <= 0xffff
  ? `\\u${cp.toString(16).toUpperCase().padStart(4, '0')}`
  : `\\u{${cp.toString(16).toUpperCase()}}`);

const WIDE = new RegExp(
  '[' + WIDE_RANGES.map(([lo, hi]) => cell(lo) + (hi > lo ? `-${cell(hi)}` : '')).join('') + ']',
  'u',
);

const ZERO = /[\\u200B\\p{Mn}\\p{Me}\\p{Cf}\\u1160-\\u11FF]/u;
const EMOJI = /\\p{Emoji_Presentation}/u;

const width = (char: string): 0 | 1 | 2 => {
  if (typeof char !== 'string') {
    throw new TypeError('width() expects a string');
  }

  if (char.length === 0) {
    return 0;
  }

  if (char.length > 1 && [...char].length > 1) {
    throw new TypeError('width() expects exactly one Unicode code point');
  }

  const cp = char.codePointAt(0)!;
  if (cp < 32 || (cp >= 0x7f && cp < 0xa0)) return 0;
  if (cp === 0xad) return 1;
  if (ZERO.test(char)) return 0;
  if (EMOJI.test(char) && !(cp >= 0x1f1e6 && cp <= 0x1f1ff)) return 2;
  return WIDE.test(char) ? 2 : 1;
};

// ponytail: widths are per code point, so a ZWJ family (👨‍👩‍👧) counts as its
// members and a text-presentation emoji followed by U+FE0F (❤️) stays narrow.
// Needs grapheme clustering (Intl.Segmenter) plus Emoji_Presentation/VS16 per
// cluster to fix; costs a segmenter per call, so opt-in only if it bites.
// Pinned by the sequence regressions in test/test.js. See #21.

const internals = { UNICODE_VERSION, WIDE_RANGES, WIDE, ZERO, EMOJI, width };

type Breakword = {
  (input: unknown, breakAtLength: number): number;
  width: typeof width;
  internals: typeof internals;
};

const breakword: Breakword = Object.assign(
  (input: unknown, breakAtLength: number) => {
    const str = String(input);
    let indexOfLastFitChar = 0;
    let fittableLength = 0;
    let index = 0;

    for (const char of str) {
      const currentLength = fittableLength + width(char);

      if (currentLength > breakAtLength) {
        break;
      }

      indexOfLastFitChar = index;
      fittableLength = currentLength;
      index += 1;
    }

    return indexOfLastFitChar;
  },
  { width, internals },
);

export = breakword;
