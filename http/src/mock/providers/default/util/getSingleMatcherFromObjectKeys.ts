import { LoadMockError } from '@mockdog/core'
import { MatcherConstants } from '../MatcherConstants.js'

export function getSingleMatcherFromObjectKeys(filename: string, keys: string[]): string {
  const matchers = keys.filter(x => MatcherConstants.includes(x))

  if (matchers.length === 0) {
    throw new LoadMockError('No matchers set!', filename)
  }

  if (matchers.length > 1) {
    throw new LoadMockError('More than one matcher set!', filename)
  }

  return matchers[0]
}
