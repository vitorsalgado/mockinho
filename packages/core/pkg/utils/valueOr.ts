import { isNullOrUndefined } from '../preconditions/utils'

export const valueOr = <T>(value: T, fallback: T): T =>
  isNullOrUndefined(value) ? fallback : value
