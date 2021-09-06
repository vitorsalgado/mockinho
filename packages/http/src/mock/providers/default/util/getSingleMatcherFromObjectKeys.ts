import { MatcherConstants } from '../MatcherConstants'
import { InvalidMockFileError } from '../InvalidMockFileError'

export function getSingleMatcherFromObjectKeys(filename: string, keys: string[]): string {
  const matchers = keys.filter(x => MatcherConstants.includes(x))

  if (matchers.length === 0) {
    throw new InvalidMockFileError('No matchers set!', filename)
  }

  if (matchers.length > 1) {
    throw new InvalidMockFileError('More than one matcher set!', filename)
  }

  return matchers[0]
}
