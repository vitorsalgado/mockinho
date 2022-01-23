/* eslint-disable no-console */

import { inspect } from 'util'
import { bold } from 'colorette'
import { redBright } from 'colorette'
import { gray } from 'colorette'
import { Mock } from './Mock.js'
import { Expectation } from './Expectation.js'

export function inspectedMatcher<M extends Mock>(
  expectation: Expectation<unknown, unknown>,
  mock: M
) {
  return function (value: unknown): boolean {
    const result = expectation.matcher(value)

    if (!result) {
      console.log(redBright(bold(`"${expectation.matcher.name}"`) + ' dit not match.'))
      console.log(
        redBright(
          `Mock: ${
            mock.sourceDescription ? `${mock.sourceDescription}` : mock.name ? mock.name : mock.id
          }`
        )
      )
    }

    console.log(gray(`Received: ${inspect(value)}`))

    return result
  }
}
