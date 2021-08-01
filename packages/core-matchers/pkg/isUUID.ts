import { validate } from 'uuid'
import { createMatcher, Matcher } from '@mockinho/core'

export const isUUID = (): Matcher<string> =>
  createMatcher(
    'isUUID',

    (value): boolean => validate(value)
  )
