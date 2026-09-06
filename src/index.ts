import wcwidth from 'wcwidth'

/**
 * Return the zero-based Unicode code-point index after which `input` should be
 * broken so that its display width does not exceed `breakAtLength`.
 */
function breakword(input: unknown, breakAtLength: number): number {
  const str = String(input)

  if (!Number.isFinite(breakAtLength) || breakAtLength < 0) {
    throw new RangeError('breakAtLength must be a finite non-negative number')
  }

  let indexOfLastFitChar = 0
  let fittableLength = 0
  let index = 0

  for (const char of str) {
    const currentLength = fittableLength + wcwidth(char)

    if (currentLength > breakAtLength) {
      break
    }

    indexOfLastFitChar = index
    fittableLength = currentLength
    index += 1
  }

  return indexOfLastFitChar
}

export = breakword
