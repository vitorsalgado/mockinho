import { Matcher } from './base/index.js'
import { indent, matcherHint } from './internal/fmt.js'
import { reach } from './internal/reach.js'
import { res } from './internal/res.js'

export const field =
  <T>(path: string, matcher: Matcher<T>): Matcher<unknown> =>
  received => {
    const matcherName = 'field'

    if (typeof received !== 'object') {
      return res(matcherName, () => 'jsonPath only accepts value of type object', false)
    }

    if (path.startsWith('$.')) {
      path = path.substring(2, path.length)
    }

    const f = reach(path, received)
    const result = matcher(f)

    return res(
      matcherName,
      () =>
        matcherHint(matcherName, path) + '\n' + `Field path: ${path}\n` + indent(result.message()),
      result.pass,
    )
  }
