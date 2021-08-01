import { createMatcher, Matcher } from '@mockinho/core'
import { validate } from 'uuid'

export const isUUID = (): Matcher<string> =>
  createMatcher(
    'isUUID',

    (value): boolean => validate(value)
  )
