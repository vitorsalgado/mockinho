import { Context } from './Context'
import { FindMockResult } from './FindMockResult'
import { MockRepository } from './MockRepository'
import { Mock } from './Mock'
import { BaseConfiguration } from './BaseConfiguration'
import { inspectedMatcher } from './inspectedMatcher'
import { Matcher } from './Matcher'

export function findMockForRequest<Req, Config extends BaseConfiguration, M extends Mock>(
  request: Req,
  context: Context<Config, M, MockRepository<M>>
): FindMockResult<M> {
  const mocks = context.mockRepository.fetchSorted()
  const weights = new Map<string, number>()

  for (const mock of mocks) {
    let weight = 0

    mock.expectations.push(
      ...mock.statefulExpectations.map(expectation => ({
        valueGetter: expectation.valueGetter,
        matcher: expectation.matcherContext(context, mock) as Matcher<unknown>,
        weight: 0
      }))
    )

    if (
      mock.expectations.every(expectation => {
        const matcher = context.configuration.modeIsAtLeast('trace')
          ? inspectedMatcher(expectation, mock)
          : expectation.matcher

        const hasMatch = matcher(expectation.valueGetter(request))

        if (hasMatch) {
          weight += expectation.weight
          weights.set(mock.id, weight)
        } else {
          if (expectation.matcher.expectation) {
            mock.meta.set(expectation.matcher.name, expectation.matcher.expectation)
          }
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
