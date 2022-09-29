import { red } from 'colorette'
import { Matcher } from './base/index.js'
import { matcherHint } from './internal/fmt.js'
import { res } from './internal/res.js'

export const empty = (): Matcher<{ length: number }> => received => {
  return res(
    'empty',
    () => matcherHint('empty') + `Length: ${red(String(received.length))}`,
    received.length === 0,
  )
}
