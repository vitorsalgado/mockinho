import { isNil } from './isNil.js'

export function notNull<T>(
  value: T,
  message: string = 'Argument must not be null or undefined.'
): T {
  if (isNil(value)) {
    throw new Error(message)
  }

  return value
}
