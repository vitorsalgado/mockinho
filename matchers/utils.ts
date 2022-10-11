import { Matcher, OnMockServed, Predicate } from './base/index.js'
import { res } from './internal/index.js'

export const fromPredicate = <V = any>(
  matcher: Matcher<V> | Predicate<V>,
  options: {
    name: string
    message: ((pass: boolean) => string) | string
    onMockServed?: OnMockServed
  } = {
    name: matcher.name,
    message: `${matcher.name} didn't match.`,
  },
): Matcher<V> => {
  return value => {
    const result = matcher(value)

    if (typeof result === 'object') {
      return result
    }

    return res(
      options.name,
      () => (typeof options.message === 'string' ? options.message : options.message(result)),
      result,
      options.onMockServed,
    )
  }
}

export const fn = <V = any>(predicate: Predicate<V>) => fromPredicate(predicate)
