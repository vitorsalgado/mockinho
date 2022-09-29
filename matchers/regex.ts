import { Matcher } from './base/index.js'
import { matcherHint } from './internal/fmt.js'
import { res } from './internal/res.js'

export const regex = (pattern: RegExp | string): Matcher<string> => {
  const re = new RegExp(pattern)
  const matcherName = 'regex'

  return received =>
    res(matcherName, () => matcherHint(matcherName, pattern.toString()), re.test(received))
}
