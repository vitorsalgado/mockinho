import { Matcher } from './base/index.js'
import { matcherHint, printExpected, printReceived, res } from './internal/index.js'

export const startsWith = (expected: string): Matcher<string> => {
  return (received: string) => {
    const matcherName = 'startsWith'

    return res(
      matcherName,
      () =>
        matcherHint(matcherName) +
        '\n' +
        `Expected: ${printExpected(expected)}\n` +
        `Received: ${printReceived(received)}`,
      received.startsWith(expected),
    )
  }
}

export const endsWith =
  (expected: string): Matcher<string> =>
  received => {
    const matcherName = 'endsWith'

    return res(
      matcherName,
      () =>
        matcherHint(matcherName) +
        '\n' +
        `Expected: ${printExpected(expected)}\n` +
        `Received: ${printReceived(received)}`,
      received.endsWith(expected),
    )
  }

export function toLowerCase(
  matcher: Matcher<string>,
  locales?: string | string[],
): Matcher<string> {
  return function toLowerCase(value) {
    return matcher(value.toLocaleLowerCase(locales))
  }
}

export function toUpperCase(
  matcher: Matcher<string>,
  locales?: string | string[],
): Matcher<string> {
  return function toUpperCase(value) {
    return matcher(value.toLocaleUpperCase(locales))
  }
}

export function trim(matcher: Matcher<string>): Matcher<string> {
  return function trim(value) {
    return matcher(value.trim())
  }
}
