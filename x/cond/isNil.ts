export function isNil<T>(value: T | undefined | null): value is NonNullable<T> {
  return value === null || typeof value === 'undefined'
}
