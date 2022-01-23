export function notBlank(value: string): string {
  if (value === null || typeof value === 'undefined' || value.trim().length === 0) {
    throw new Error('String must not be blank.')
  }

  return value
}
