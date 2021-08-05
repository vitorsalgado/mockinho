import { Matcher } from '@mockinho/core'
import { jsonPath } from '@mockinho/core-matchers'

export const fieldPath = <T>(path: string, matcher: Matcher<T>): Matcher<any> => {
  return function filePath(value, ctx): boolean {
    return jsonPath(path, matcher)(value, ctx)
  }
}
