import { LoadMockError } from '@mockdog/core'
import { MatcherConstants } from '../MatcherConstants.js'

export function findRequiredMatcherEntry(
  values: [string, unknown][],
  filename: string,
  errorMessage: string,
): [string, unknown] {
  const entry = values.find(([key]) => MatcherConstants.includes(key))

  if (!entry) {
    if (!entry) {
      throw new LoadMockError(errorMessage, filename)
    }
  }

  return entry
}
