import { Matcher } from '@mockinho/core'
import { both } from './both'

export const bothAre = <T>(first: Matcher<T>): { and(second: Matcher<T>): Matcher<T> } => ({
  and(second: Matcher<T>): Matcher<T> {
    return both(first, second)
  }
})
