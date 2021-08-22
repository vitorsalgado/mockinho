/* eslint-disable no-console */
import { IncomingMessage } from 'http'
import { inspect } from 'util'
import { bold } from 'colorette'
import { redBright } from 'colorette'
import { Context } from './Context'
import { FindMockResult } from './FindMockResult'
import { MockRepository } from './MockRepository'
import { Mock } from './Mock'
import { Configuration } from './Configuration'
import { Expectation } from './Expectation'

export function findMockForRequest<Req, Config extends Configuration, M extends Mock>(
  request: Req,
  context: Context<Config, M, MockRepository<M>>
): FindMockResult<M> {
  const mocks = context.mockRepository.fetchSorted()
  const weights = new Map<string, number>()

  for (const mock of mocks) {
    let weight = 0

    if (
      mock.expectations.every(expectation => {
        const matcher = context.configurations.trace
          ? inspectedMatcher(expectation, mock)
          : expectation.matcher

        const hasMatch = matcher(expectation.valueGetter(request))

        if (hasMatch) {
          weight += expectation.weight
          weights.set(mock.id, weight)
        }

        return hasMatch
      })
    ) {
      mock.hit()
      context.mockRepository.save(mock)

      return FindMockResult.match(mock)
    }
  }

  if (weights.size === 0) {
    return FindMockResult.noMatch()
  }

  const key = Array.from(weights)
    .sort((a, b) => b[1] - a[1])
    .shift()?.[0]

  if (!key) {
    return FindMockResult.noMatch()
  }

  return FindMockResult.noMatch(context.mockRepository.fetchById(key).get())
}

function inspectedMatcher<M extends Mock>(expectation: Expectation<unknown, unknown>, mock: M) {
  return function (value: unknown) {
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
