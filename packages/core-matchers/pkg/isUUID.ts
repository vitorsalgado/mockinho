import { validate } from 'uuid'
import { Matcher } from '@mockinho/core'

export const isUUID = (): Matcher<string> => {
  return function isUUID(value): boolean {
    return validate(value)
  }
}
