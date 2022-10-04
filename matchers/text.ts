import { NullOrUndef } from '@mockdog/x'
import { Matcher } from './base/index.js'
import { matcherHint, printExpected, printReceived, res } from './internal/index.js'

export const regex = (pattern: RegExp | string): Matcher<string> => {
  const re = new RegExp(pattern)
  const matcherName = 'regex'

  return received => {
    if (received === null || received === undefined) {
      return res(matcherName, () => matcherHint(matcherName, typeof received), false)
    }

    return res(matcherName, () => matcherHint(matcherName, pattern.toString()), re.test(received))
  }
}

export const startsWith = (expected: string): Matcher<NullOrUndef<string>> => {
  return received => {
    const matcherName = 'startsWith'

    if (received === null || received === undefined) {
      return res(matcherName, () => matcherHint(matcherName, typeof received), false)
    }

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
  (expected: string): Matcher<NullOrUndef<string>> =>
  received => {
    const matcherName = 'endsWith'

    if (received === null || received === undefined) {
      return res(matcherName, () => matcherHint(matcherName, typeof received), false)
    }

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
  (
    matcher: Matcher<NullOrUndef<string>>,
    locales?: string | string[],
  ): Matcher<NullOrUndef<string>> =>
  value =>
    matcher(value === null || value === undefined ? null : value.toLocaleLowerCase(locales))

export const toUpperCase =
  (
    matcher: Matcher<NullOrUndef<string>>,
    locales?: string | string[],
  ): Matcher<NullOrUndef<string>> =>
  value =>
    matcher(value === null || value === undefined ? null : value.toLocaleUpperCase(locales))

export const trim =
  (matcher: Matcher<NullOrUndef<string>>): Matcher<NullOrUndef<string>> =>
  value =>
    matcher(value === null || value === undefined ? null : value.trim())
