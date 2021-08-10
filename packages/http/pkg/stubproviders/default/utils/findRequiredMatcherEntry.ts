import { MatcherConstants } from '../MatcherConstants'
import { InvalidStubFileError } from '../InvalidStubFileError'

export function findRequiredMatcherEntry(
  values: [string, unknown][],
  filename: string,
  errorMessage: string
): [string, unknown] {
  const entry = values.find(([key]) => MatcherConstants.includes(key))

  if (!entry) {
    if (!entry) {
      throw new InvalidStubFileError(errorMessage, filename)
    }
  }

  return entry
}
