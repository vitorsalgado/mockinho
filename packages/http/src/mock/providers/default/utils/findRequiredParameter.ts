import { InvalidMockFileError } from '../InvalidMockFileError'

export function findRequiredParameter<T>(
  parameter: string,
  values: [string, unknown][],
  filename: string,
  errorMessage: string
): T {
  const entry = values.find(([k]) => k === parameter)

  if (!entry) {
    throw new InvalidMockFileError(errorMessage, filename)
  }

  return entry[1] as T
}
