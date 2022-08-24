import { Matcher } from './base.js'
import { either } from './either.js'

export const eitherAre = <T>(first: Matcher<T>): { or(second: Matcher<T>): Matcher<T> } => ({
  or(second: Matcher<T>): Matcher<T> {
    return either(first, second)
  }
})
