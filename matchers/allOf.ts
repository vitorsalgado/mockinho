import { Result } from './base/index.js'
import { Matcher } from './base/index.js'
import { indent, matcherHint } from './internal/fmt.js'
import { res } from './internal/res.js'

export const allOf =
  <T>(...matchers: Array<Matcher<T>>): Matcher<T> =>
  received => {
    const matcherName = 'allOf'
    const msg: [number, Result][] = []
    let pass = true

    for (let i = 0; i < matchers.length; i++) {
      const r = matchers[i](received)

      if (!r.pass) {
        pass = false
        msg.push([i, r])
      }
    }

    return res(
      matcherName,
      () =>
        matcherHint(matcherName) +
        '\n' +
        'Result: \n' +
        msg.map(([i, r]) => `${String(i)}${indent(r.message())}`).join('\n\n'),
      pass,
    )
  }
