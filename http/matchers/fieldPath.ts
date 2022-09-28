import { jsonPath } from 'matchers'
import { Matcher } from '@mockdog/core'

export const fieldPath = <T>(path: string, matcher: Matcher<T>): Matcher<unknown> =>
  function filePath(value): boolean {
    return jsonPath(path, matcher)(value)
  }
