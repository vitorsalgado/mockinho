import { Matcher } from './base.js'

export const repeatTimes = (max: number): Matcher => {
  if (max <= 0) {
    throw new RangeError('Parameter max must be greater than 0.')
  }

  let hits = 0

  return function repeatTimes(): boolean {
    hits++

    return hits <= max
  }
}
