import { Context } from './Context.js'
import { FindMockResult } from './FindMockResult.js'
import { MockRepository } from './MockRepository.js'
import { Mock } from './Mock.js'
import { inspectedMatcher } from './inspectedMatcher.js'
import { Matcher } from './Matcher.js'
import { modeIsAtLeast } from './modeIsAtLeast.js'
import { Configuration } from './Configuration.js'

export function findMockForRequest<REQUEST, MOCK extends Mock, CONFIG extends Configuration>(
  request: REQUEST,
  context: Context<MOCK, CONFIG, MockRepository<MOCK>>,
): FindMockResult<MOCK> {
  const mocks = context.mockRepository.fetchSorted()
  const weights = new Map<string, number>()

  for (const mock of mocks) {
    let weight = 0

    mock.expectations.push(
      ...mock.statefulExpectations<MOCK, CONFIG>().map(expectation => ({
        valueGetter: expectation.valueGetter,
        matcher: expectation.matcherContext(context, mock) as Matcher<unknown>,
        weight: 0,
      })),
    )

    if (
      mock.expectations.every(expectation => {
        const matcher = modeIsAtLeast(context.configuration, 'trace')
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
