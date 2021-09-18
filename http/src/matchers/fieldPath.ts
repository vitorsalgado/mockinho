import { Matcher } from '@mockdog/core'
import { jsonPath } from '@mockdog/core-matchers'

export const fieldPath = <T>(path: string, matcher: Matcher<T>): Matcher<unknown> =>
  function filePath(value): boolean {
    return jsonPath(path, matcher)(value)
  }
