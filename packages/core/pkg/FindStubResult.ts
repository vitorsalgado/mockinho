import { Stub } from './Stub'
import { Optional } from './utils'

export class FindStubResult<Request, ResDef> {
  constructor(
    private readonly _hasMatch: boolean,
    private readonly _matchedStub?: Stub<Request, ResDef>,
    private readonly _closesMatch?: Stub<Request, ResDef>
  ) {
    if (_hasMatch && !_matchedStub) {
      throw new TypeError('If there is a match, you need to provide the matched stub.')
    }
  }

  static noMatch = <Request, ResDef>(
    closestMatch?: Stub<Request, ResDef>
  ): FindStubResult<Request, ResDef> => new FindStubResult(false, undefined, closestMatch)

  static match = <Request, ResDef>(
    matchedStub: Stub<Request, ResDef>
  ): FindStubResult<Request, ResDef> => new FindStubResult<Request, ResDef>(true, matchedStub)

  hasMatch(): boolean {
    return this._hasMatch
  }

  matched(): Stub<Request, ResDef> {
    if (!this._matchedStub) {
      throw new ReferenceError(
        'Tried to get the matched stub when it is null. Check if hasMatch() first.'
      )
    }

    return this._matchedStub
  }

  closestMatch(): Optional<Stub<Request, ResDef>> {
    return Optional.ofNullable(this._closesMatch)
  }
}
