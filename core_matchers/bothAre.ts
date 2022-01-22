import { Matcher } from '@mockdog/core'
import { both } from './both.js'

export const bothAre = <T>(first: Matcher<T>): { and(second: Matcher<T>): Matcher<T> } => ({
  and(second: Matcher<T>): Matcher<T> {
    return both(first, second)
  }
})
