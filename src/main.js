'use strict';

const wcwidth = require('wcwidth');

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
    const currentLength = fittableLength + wcwidth(char);

    if (currentLength > breakAtLength) {
      break;
    }

    indexOfLastFitChar = index;
    fittableLength = currentLength;
    index += 1;
  }

  return indexOfLastFitChar;
};
