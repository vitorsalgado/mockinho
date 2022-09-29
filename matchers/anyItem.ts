import { red } from 'colorette'
import { green } from 'colorette'
import { Matcher } from './base/index.js'
import { matcherHint } from './internal/fmt.js'
import { stringify } from './internal/fmt.js'
import { res } from './internal/res.js'

export const anyItem =
  (...items: Array<string>): Matcher<string> =>
  received =>
    res(
      'anyItem',
      () =>
        matcherHint('anyItem') +
        '\n' +
        `Expected item: ${green(stringify(received))}\nArray: ${red(stringify(items))}`,
      items.includes(received),
    )
