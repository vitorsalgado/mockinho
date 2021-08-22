import { MatcherConstants } from '../MatcherConstants'
import { InvalidMockFileError } from '../InvalidMockFileError'

export function findRequiredMatcherEntry(
  values: [string, unknown][],
  filename: string,
  errorMessage: string
): [string, unknown] {
  const entry = values.find(([key]) => MatcherConstants.includes(key))

  if (!entry) {
    if (!entry) {
      throw new InvalidMockFileError(errorMessage, filename)
    }
  }

  return entry
}
