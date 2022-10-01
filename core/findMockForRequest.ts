import { Optional } from '@mockdog/x'
import { Mock } from './mock.js'

export class FindMockResult<MOCK> {
  constructor(
    private readonly _hasMatch: boolean,
    private readonly _matchedMock?: MOCK,
    private readonly _closesMatch?: MOCK,
  ) {
    if (_hasMatch && !_matchedMock) {
      throw new TypeError('If there is a match, you need to provide the matched mock.')
    }
  }

  static noMatch = <S>(closestMatch?: S): FindMockResult<S> =>
    new FindMockResult(false, undefined, closestMatch)

  static match = <M>(matchedMock: M): FindMockResult<M> => new FindMockResult(true, matchedMock)

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
}

export function findMockForRequest<REQUEST, MOCK extends Mock<REQUEST>>(
  request: REQUEST,
  mocks: MOCK[],
): FindMockResult<MOCK> {
  let id = ''
  let highestScore = 0

  for (const mock of mocks) {
    const result = mock.matches(request)

    if (result.ok) {
      return FindMockResult.match(mock)
    }

    if (highestScore < result.score) {
      highestScore = result.score
      id = mock.id
    }
  }

  if (id === '') {
    return FindMockResult.noMatch()
  }

  return FindMockResult.noMatch(mocks.find(x => x.id === id))
}
