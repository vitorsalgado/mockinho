import { Matcher } from './base/index.js'
import { indent, matcherHint } from './internal/fmt.js'
import { reach } from './internal/reach.js'
import { res } from './internal/res.js'

export const jsonPath =
  <T>(path: string, matcher: Matcher<T>): Matcher<unknown> =>
  received => {
    const matcherName = 'jsonPath'

    if (typeof received !== 'object') {
      return res(matcherName, () => 'jsonPath only accepts value of type object', false)
    }

    if (path.startsWith('$.')) {
      path = path.substring(2, path.length)
    }

    const result = matcher(reach(path, received))

    return res(
      matcherName,
      () =>
        matcherHint(matcherName, path) + '\n' + `Field path: ${path}\n` + indent(result.message()),
      result.pass,
    )
  }
