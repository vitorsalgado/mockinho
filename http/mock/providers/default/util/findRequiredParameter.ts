import { LoadMockError } from '@mockdog/core'

export function findRequiredParameter<T>(
  parameter: string,
  values: [string, unknown][],
  filename: string,
  errorMessage: string,
): T {
  const entry = values.find(([k]) => k === parameter)

  if (!entry) {
    throw new LoadMockError(errorMessage, filename)
  }

  return entry[1] as T
}
