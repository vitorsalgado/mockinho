import { Optional } from '../util'
import { Mock } from './Mock'

export class FindMockResult<S extends Mock> {
  constructor(
    private readonly _hasMatch: boolean,
    private readonly _matchedMock?: S,
    private readonly _closesMatch?: S
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

  matched(): S {
    if (!this._matchedMock) {
      throw new ReferenceError(
        'Tried to get the matched mock when it is null. Check if hasMatch() first.'
      )
    }

    return this._matchedMock
  }

  closestMatch(): Optional<Mock> {
    return Optional.ofNullable(this._closesMatch)
  }
}
