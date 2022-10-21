import { Optional } from '@mockdog/x'
import { Result } from '@mockdog/matchers'
import { Mismatch, Mock } from './mock.js'

export class FindMockResult<MOCK> {
  constructor(
    private readonly _hasMatch: boolean,
    private readonly _results: Result[],
    private readonly _mismatches: Mismatch[],
    private readonly _matchedMock?: MOCK,
    private readonly _closesMatch?: MOCK,
  ) {
    if (_hasMatch && !_matchedMock) {
      throw new TypeError('If there is a match, you need to provide the matched mock.')
    }
  }

  static mismatch = <S>(mismatches: Mismatch[], closestMatch?: S): FindMockResult<S> =>
    new FindMockResult(false, [], mismatches, undefined, closestMatch)

  static match = <M>(results: Result[], matchedMock: M): FindMockResult<M> =>
    new FindMockResult(true, results, [], matchedMock, undefined)

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

  closestMatch(): Optional<MOCK> {
    return Optional.ofNullable(this._closesMatch)
  }

  results(): Result[] {
    return this._results
  }
}

export function findMockForRequest<REQUEST, MOCK extends Mock<REQUEST>>(
  request: REQUEST,
  mocks: MOCK[],
): FindMockResult<MOCK> {
  let id = ''
  let highestScore = 0
  const mismatches: Mismatch[] = []

  for (const mock of mocks) {
    const result = mock.requestMatches(request)

    if (result.ok) {
      return FindMockResult.match(result.results, mock)
    }

    if (highestScore < result.score) {
      highestScore = result.score
      id = mock.id
    }

    mismatches.push(...result.mismatches)
  }

  if (id === '') {
    return FindMockResult.mismatch<MOCK>(mismatches)
  }

  return FindMockResult.mismatch<MOCK>(
    mismatches,
    mocks.find(x => x.id === id),
  )
}
