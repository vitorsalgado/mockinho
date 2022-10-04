import { red } from 'colorette'
import { NullOrUndef } from '@mockdog/x'
import { Matcher } from './base/index.js'
import { matcherHint } from './internal/fmt.js'
import { res } from './internal/res.js'

export const empty = (): Matcher<NullOrUndef<{ length: number }>> => received => {
  const matcherName = 'empty'

  if (received === null || typeof received === 'undefined') {
    return res(matcherName, () => matcherHint(matcherName, 'nil'), false)
  }

  return res(
    matcherName,
    () => matcherHint(matcherName, `${red(String(received.length))}`),
    received.length === 0,
  )
}
