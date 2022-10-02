import { Matcher } from './base/index.js'
import { matcherHint } from './internal/fmt.js'
import { res } from './internal/res.js'

export const repeatTimes = (max: number): Matcher => {
  if (max <= 0) {
    throw new RangeError('Parameter max must be greater than 0.')
  }

  const matcherName = 'repeatTimes'

  let hits = 0

  return _ => {
    const pass = hits < max

    return res(
      matcherName,
      () => matcherHint(matcherName, String(max)),
      pass,
      () => {
        hits++
      },
    )
  }
}
