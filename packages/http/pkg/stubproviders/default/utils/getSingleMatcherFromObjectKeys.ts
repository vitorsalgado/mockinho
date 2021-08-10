import { MatcherConstants } from '../MatcherConstants'
import { InvalidStubFileError } from '../InvalidStubFileError'

export function getSingleMatcherFromObjectKeys(filename: string, keys: string[]): string {
  const matchers = keys.filter(x => MatcherConstants.includes(x))

  if (matchers.length === 0) {
    throw new InvalidStubFileError('No matchers set!', filename)
  }

  if (matchers.length > 1) {
    throw new InvalidStubFileError('More than one matcher set!', filename)
  }

  return matchers[0]
}
