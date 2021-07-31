import { validate } from 'uuid'
import { createMatcher, Matcher } from './base'

export const isUUID = (): Matcher<string> =>
  createMatcher(
    'isUUID',

    (value): boolean => validate(value)
  )
