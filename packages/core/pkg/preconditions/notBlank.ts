import { InvalidArgumentError } from './InvalidArgumentError'
import { isNullOrUndefined } from './utils'

export function notBlank(value: string): string {
  if (isNullOrUndefined(value) || value.trim().length === 0) {
    throw new InvalidArgumentError('String must not be blank.')
  }

  return value
}
