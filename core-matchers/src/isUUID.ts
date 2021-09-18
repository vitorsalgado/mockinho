import { validate } from 'uuid'
import { Matcher } from '@mockdog/core'

export const isUUID = (): Matcher<string> =>
  function isUUID(value): boolean {
    return validate(value)
  }
