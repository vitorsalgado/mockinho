import { Matcher } from './base/index.js'
import { matcherHint } from './internal/fmt.js'
import { res } from './internal/res.js'

const UUID_REGEX =
  /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i

export const isUUID = (): Matcher<string> => received => {
  const matcherName = 'isUUID'
  return res(matcherName, () => matcherHint(matcherName, received), UUID_REGEX.test(received))
}
