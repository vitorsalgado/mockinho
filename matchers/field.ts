import { red } from 'colorette'
import { Matcher } from './base/index.js'
import { indent, matcherHint } from './internal/fmt.js'
import { reach } from './internal/reach.js'
import { res } from './internal/res.js'

const _matcherName = 'field'

export const field =
  <T>(path: string, matcher: Matcher<T>): Matcher<unknown> =>
  received => {
    if (typeof received !== 'object') {
      return fail(path, `Expected value to be an object. got ${red(typeof received)}`)
    }

    if (path.startsWith('$.')) {
      path = path.substring(2, path.length)
    }

    if (Array.isArray(received)) {
      if (!path.startsWith('[')) {
        throw new TypeError('')
      }
    }

    const f = reach(path, received)
    const result = matcher(f)

    return res(
      _matcherName,
      () =>
        matcherHint(_matcherName, path) + '\n' + `Field path: ${path}\n` + indent(result.message()),
      result.pass,
    )
  }

function fail(path: string, hint: string) {
  return res(_matcherName, () => matcherHint(_matcherName, path) + '\n' + hint, false)
}
