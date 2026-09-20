'use strict';

/**
 * East Asian Wide (W) and Fullwidth (F) code-point ranges, from the Unicode
 * Character Database EastAsianWidth.txt (including the @missing defaults for
 * unassigned planes). Regenerate with `node tools/gen-wide.mjs`.
 */
/* <wide> */
// East Asian Width W+F ranges — 2026-06-29, 15:25:05 GMT
const WIDE = new RegExp(
  '[' + [
  '\\u1100-\\u115F',
  '\\u231A-\\u231B',
  '\\u2329-\\u232A',
  '\\u23E9-\\u23EC',
  '\\u23F0',
  '\\u23F3',
  '\\u25FD-\\u25FE',
  '\\u2614-\\u2615',
  '\\u2630-\\u2637',
  '\\u2648-\\u2653',
  '\\u267F',
  '\\u268A-\\u268F',
  '\\u2693',
  '\\u26A1',
  '\\u26AA-\\u26AB',
  '\\u26BD-\\u26BE',
  '\\u26C4-\\u26C5',
  '\\u26CE',
  '\\u26D4',
  '\\u26EA',
  '\\u26F2-\\u26F3',
  '\\u26F5',
  '\\u26FA',
  '\\u26FD',
  '\\u2705',
  '\\u270A-\\u270B',
  '\\u2728',
  '\\u274C',
  '\\u274E',
  '\\u2753-\\u2755',
  '\\u2757',
  '\\u2795-\\u2797',
  '\\u27B0',
  '\\u27BF',
  '\\u2B1B-\\u2B1C',
  '\\u2B50',
  '\\u2B55',
  '\\u2E80-\\u2E99',
  '\\u2E9B-\\u2EF3',
  '\\u2F00-\\u2FD5',
  '\\u2FF0-\\u303E',
  '\\u3041-\\u3096',
  '\\u3099-\\u30FF',
  '\\u3105-\\u312F',
  '\\u3131-\\u318E',
  '\\u3190-\\u31E5',
  '\\u31EF-\\u321E',
  '\\u3220-\\u3247',
  '\\u3250-\\uA48C',
  '\\uA490-\\uA4C6',
  '\\uA960-\\uA97C',
  '\\uAC00-\\uD7A3',
  '\\uF900-\\uFAFF',
  '\\uFE10-\\uFE19',
  '\\uFE30-\\uFE52',
  '\\uFE54-\\uFE66',
  '\\uFE68-\\uFE6B',
  '\\uFF01-\\uFF60',
  '\\uFFE0-\\uFFE6',
  '\\u{16FE0}-\\u{16FE4}',
  '\\u{16FF0}-\\u{16FF6}',
  '\\u{17000}-\\u{18CDA}',
  '\\u{18CFF}-\\u{18D20}',
  '\\u{18D80}-\\u{18DF2}',
  '\\u{18E00}-\\u{19191}',
  '\\u{191A0}-\\u{191D2}',
  '\\u{1AFF0}-\\u{1AFF3}',
  '\\u{1AFF5}-\\u{1AFFB}',
  '\\u{1AFFD}-\\u{1AFFE}',
  '\\u{1B000}-\\u{1B128}',
  '\\u{1B132}',
  '\\u{1B150}-\\u{1B152}',
  '\\u{1B155}',
  '\\u{1B164}-\\u{1B168}',
  '\\u{1B170}-\\u{1B2FB}',
  '\\u{1D300}-\\u{1D356}',
  '\\u{1D360}-\\u{1D376}',
  '\\u{1F004}',
  '\\u{1F0CF}',
  '\\u{1F18E}',
  '\\u{1F191}-\\u{1F19A}',
  '\\u{1F1AE}',
  '\\u{1F200}-\\u{1F202}',
  '\\u{1F210}-\\u{1F23B}',
  '\\u{1F240}-\\u{1F248}',
  '\\u{1F250}-\\u{1F251}',
  '\\u{1F260}-\\u{1F265}',
  '\\u{1F300}-\\u{1F320}',
  '\\u{1F32D}-\\u{1F335}',
  '\\u{1F337}-\\u{1F37C}',
  '\\u{1F37E}-\\u{1F393}',
  '\\u{1F3A0}-\\u{1F3CA}',
  '\\u{1F3CF}-\\u{1F3D3}',
  '\\u{1F3E0}-\\u{1F3F0}',
  '\\u{1F3F4}',
  '\\u{1F3F8}-\\u{1F43E}',
  '\\u{1F440}',
  '\\u{1F442}-\\u{1F4FC}',
  '\\u{1F4FF}-\\u{1F53D}',
  '\\u{1F54B}-\\u{1F54E}',
  '\\u{1F550}-\\u{1F567}',
  '\\u{1F57A}',
  '\\u{1F595}-\\u{1F596}',
  '\\u{1F5A4}',
  '\\u{1F5FB}-\\u{1F64F}',
  '\\u{1F680}-\\u{1F6C5}',
  '\\u{1F6CC}',
  '\\u{1F6D0}-\\u{1F6D2}',
  '\\u{1F6D5}-\\u{1F6D9}',
  '\\u{1F6DC}-\\u{1F6DF}',
  '\\u{1F6EB}-\\u{1F6EC}',
  '\\u{1F6F4}-\\u{1F6FC}',
  '\\u{1F7DA}',
  '\\u{1F7E0}-\\u{1F7EB}',
  '\\u{1F7F0}',
  '\\u{1F90C}-\\u{1F93A}',
  '\\u{1F93C}-\\u{1F945}',
  '\\u{1F947}-\\u{1F9FF}',
  '\\u{1FA70}-\\u{1FA7C}',
  '\\u{1FA80}-\\u{1FAC6}',
  '\\u{1FAC8}',
  '\\u{1FACC}-\\u{1FADD}',
  '\\u{1FADF}-\\u{1FAEB}',
  '\\u{1FAEF}-\\u{1FAFA}',
  '\\u{20000}-\\u{2FFFD}',
  '\\u{30000}-\\u{3FFFD}',
  ].join('') + ']',
  'u',
);
/* </wide> */

/**
 * Zero-width: non-spacing/enclosing marks and format characters, plus the two
 * cases Unicode classifies elsewhere — ZERO WIDTH SPACE (Zs) and the Hangul Jamo
 * medial vowels and final consonants.
 */
const ZERO = /[\u200B\p{Mn}\p{Me}\p{Cf}\u1160-\u11FF]/u;

// Emoji that occupy two cells by default (Unicode Standard Annex #51).
const EMOJI = /\p{Emoji_Presentation}/u;

const width = (char) => {
  const cp = char.codePointAt(0);
  if (cp < 32 || (cp >= 0x7f && cp < 0xa0)) return 0; // C0/C1 controls
  if (cp === 0xad) return 1; // SOFT HYPHEN, width 1 by the wcwidth() convention
  if (ZERO.test(char)) return 0;
  // Regional indicators are only wide in pairs, which sum to the two cells of
  // one flag glyph.
  if (EMOJI.test(char) && !(cp >= 0x1f1e6 && cp <= 0x1f1ff)) return 2;
  return WIDE.test(char) ? 2 : 1;
};
// ponytail: widths are per code point, so a ZWJ family (👨‍👩‍👧) counts as its
// members and a text-presentation emoji followed by U+FE0F (❤️) stays narrow.
// Needs grapheme clustering (Intl.Segmenter) plus Emoji_Presentation/VS16 per
// cluster to fix; costs a segmenter per call, so opt-in only if it bites.

/**
 * Return the zero-based character index after which `input` should be broken
 * so that its display width does not exceed `breakAtLength`.
 *
 * Indices are based on Unicode code points rather than UTF-16 code units.
 */
module.exports = function breakword(input, breakAtLength) {
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
};
