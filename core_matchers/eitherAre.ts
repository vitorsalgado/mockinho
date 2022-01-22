import { Matcher } from '@mockdog/core'
import { either } from './either.js'

export const eitherAre = <T>(first: Matcher<T>): { or(second: Matcher<T>): Matcher<T> } => ({
  or(second: Matcher<T>): Matcher<T> {
    return either(first, second)
  }
})
