import { Optional } from '@mockdog/x'
import { Configuration } from './configuration.js'
import { Context } from './context.js'
import { Mock } from './mock.js'
import { MockRepository } from './mockrepository.js'

export class FindMockResult<MOCK extends Mock> {
  constructor(
    private readonly _hasMatch: boolean,
    private readonly _matchedMock?: MOCK,
    private readonly _closesMatch?: MOCK,
  ) {
    if (_hasMatch && !_matchedMock) {
      throw new TypeError('If there is a match, you need to provide the matched mock.')
    }
  }

  static noMatch = <S extends Mock>(closestMatch?: S): FindMockResult<S> =>
    new FindMockResult(false, undefined, closestMatch)

  static match = <M extends Mock>(matchedMock: M): FindMockResult<M> =>
    new FindMockResult(true, matchedMock)

  hasMatch(): boolean {
    return this._hasMatch
  }

  matched(): MOCK {
    if (!this._matchedMock) {
      throw new ReferenceError(
        'Tried to get the matched mock when it is null. Check if hasMatch() first.',
      )
    }

    return this._matchedMock
  }

  closestMatch(): Optional<Mock> {
    return Optional.ofNullable(this._closesMatch)
  }
}

export function findMockForRequest<REQUEST, MOCK extends Mock, CONFIG extends Configuration>(
  request: REQUEST,
  context: Context<MOCK, CONFIG, MockRepository<MOCK>>,
): FindMockResult<MOCK> {
  const mocks = context.mockRepository.fetchSorted()
  const weights = new Map<string, number>()

  for (const mock of mocks) {
    let weight = 0

    if (mock.matches(request)) {
      mock.hit()
      context.mockRepository.save(mock)

      return FindMockResult.match(mock)
    }

    if (
      mock.matchers.every(expectation => {
        const hasMatch = expectation.matcher(expectation.selector(request))

        if (hasMatch) {
          weight += expectation.score
          weights.set(mock.id, weight)
        }

        return hasMatch
      })
    ) {
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
