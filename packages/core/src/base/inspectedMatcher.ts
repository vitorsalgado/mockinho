/* eslint-disable no-console */

import { IncomingMessage } from 'http'
import { inspect } from 'util'
import { bold } from 'colorette'
import { redBright } from 'colorette'
import { Mock } from './Mock'
import { Expectation } from './Expectation'

export function inspectedMatcher<M extends Mock>(
  expectation: Expectation<unknown, unknown>,
  mock: M
) {
  return function (value: unknown): boolean {
    console.log(
      bold(redBright(`${expectation.container}: "${expectation.matcher.name}" did not match.`))
    )
    console.log(
      redBright(
        `Mock: ${
          mock.sourceDescription ? `${mock.sourceDescription}` : mock.name ? mock.name : mock.id
        }`
      )
    )
    console.log(
      redBright(
        `Received: ${value && value instanceof IncomingMessage ? value.toString() : inspect(value)}`
      )
    )

    return expectation.matcher(value)
  }
}
