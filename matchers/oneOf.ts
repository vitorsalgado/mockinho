import { yellow } from 'colorette'
import { Matcher } from './base/index.js'
import { equalTo } from './equalTo.js'
import { indent, matcherHint, stringify } from './internal/fmt.js'
import { res } from './internal/res.js'

export const oneOf =
  <T>(list: Array<T>, options: { ignoreCase?: boolean } = { ignoreCase: true }): Matcher<T> =>
  received => {
    const matcherName = 'oneOf'
    const result = list.some(x => equalTo(x, options.ignoreCase)(received).pass)

    return res(
      matcherName,
      () =>
        matcherHint(matcherName, stringify(list)) +
        '\n' +
        indent(
          `Value ${yellow(stringify(received))} is not present in the array ${yellow(
            stringify(list),
          )}`,
        ),
      result,
    )
  }
