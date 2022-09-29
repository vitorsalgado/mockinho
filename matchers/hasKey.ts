import { Matcher } from './base/index.js'
import { indent, matcherHint } from './internal/fmt.js'
import { res } from './internal/res.js'
import { jsonPath } from './jsonPath.js'
import { isPresent } from './isPresent.js'

export const hasKey =
  (path: string): Matcher<unknown> =>
  received => {
    const matcherName = 'hasKey'
    const result = jsonPath(path, isPresent())(received)

    return res(
      matcherName,
      () => matcherHint(matcherName, path) + '\n' + indent(result.message()),
      result.pass,
    )
  }
