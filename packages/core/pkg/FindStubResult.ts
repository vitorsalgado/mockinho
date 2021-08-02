import { Stub } from './Stub'
import { Optional } from './utils'
import { Context } from './Context'
import { ResponseDefinitionBuilder } from './ResponseDefinitionBuilder'

export class FindStubResult<
  Ctx extends Context,
  Req,
  Res,
  ResBuilder extends ResponseDefinitionBuilder<Ctx, Req, Res>
> {
  constructor(
    private readonly _hasMatch: boolean,
    private readonly _matchedStub?: Stub<Ctx, Req, Res, ResBuilder>,
    private readonly _closesMatch?: Stub<Ctx, Req, Res, ResBuilder>
  ) {
    if (_hasMatch && !_matchedStub) {
      throw new TypeError('If there is a match, you need to provide the matched stub.')
    }
  }

  static noMatch = <
    Ctx extends Context,
    Req,
    Res,
    ResBuilder extends ResponseDefinitionBuilder<Ctx, Req, Res>
  >(
    closestMatch?: Stub<Ctx, Req, Res, ResBuilder>
  ): FindStubResult<Ctx, Req, Res, ResBuilder> => new FindStubResult(false, undefined, closestMatch)

  static match = <
    Ctx extends Context,
    Req,
    Res,
    ResBuilder extends ResponseDefinitionBuilder<Ctx, Req, Res>
  >(
    matchedStub: Stub<Ctx, Req, Res, ResBuilder>
  ): FindStubResult<Ctx, Req, Res, ResBuilder> => new FindStubResult(true, matchedStub)

  hasMatch(): boolean {
    return this._hasMatch
  }

  matched(): Stub<Ctx, Req, Res, ResBuilder> {
    if (!this._matchedStub) {
      throw new ReferenceError(
        'Tried to get the matched stub when it is null. Check if hasMatch() first.'
      )
    }

    return this._matchedStub
  }

  closestMatch(): Optional<Stub<Ctx, Req, Res, ResBuilder>> {
    return Optional.ofNullable(this._closesMatch)
  }
}
