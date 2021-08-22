import { validate } from 'uuid'
import { Matcher } from '@mockinho/core'

export const isUUID = (): Matcher<string> =>
  function isUUID(value): boolean {
    return validate(value)
  }
