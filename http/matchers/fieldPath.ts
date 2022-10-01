import { jsonPath } from '@mockdog/matchers'
import { Matcher } from '@mockdog/matchers'

export const fieldPath =
  <T>(path: string, matcher: Matcher<T>): Matcher<unknown> =>
  value =>
    jsonPath(path, matcher)(value)
