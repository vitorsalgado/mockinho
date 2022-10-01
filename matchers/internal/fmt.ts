import prettyFormat from 'pretty-format'
import { bold, green, red } from 'colorette'

export function stringify(v: unknown): string {
  return prettyFormat(v, { min: true })
}

export function matcherHint(name: string, param: string = ''): string {
  return 'Matcher: ' + bold(name) + (param === '' ? '' : `(${param})`)
}

export function printExpected(expected: unknown): string {
  return green(stringify(expected))
}

export function printReceived(received: unknown): string {
  return red(stringify(received))
}

export function indent(str: string, c: number = 2, i: string = ' '): string {
  return str.replace(/^/gm, i.repeat(c))
}
