import { Matcher } from '@mockinho/core'
import { jsonPath } from '@mockinho/core-matchers'

export const fieldPath = <T>(path: string, matcher: Matcher<T>): Matcher<unknown> =>
  function filePath(value): boolean {
    return jsonPath(path, matcher)(value)
  }
