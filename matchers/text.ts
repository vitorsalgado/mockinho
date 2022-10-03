import { Matcher } from './base/index.js'
import { matcherHint, printExpected, printReceived, res } from './internal/index.js'

export const regex = (pattern: RegExp | string): Matcher<string> => {
  const re = new RegExp(pattern)
  const matcherName = 'regex'

  return received =>
    res(matcherName, () => matcherHint(matcherName, pattern.toString()), re.test(received))
}

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

export const toLowerCase =
  (matcher: Matcher<string>, locales?: string | string[]): Matcher<string> =>
  value =>
    matcher(value.toLocaleLowerCase(locales))

export const toUpperCase =
  (matcher: Matcher<string>, locales?: string | string[]): Matcher<string> =>
  value =>
    matcher(value.toLocaleUpperCase(locales))

export const trim =
  (matcher: Matcher<string>): Matcher<string> =>
  value =>
    matcher(value.trim())
