import { Matcher } from '../pkg/shared/matchers'
import { Context } from './Context'
import { SCENARIO_STATE_STARTED } from './Scenario'
import { scenarioMatcher } from './scenarioMatcher'
import { Stub } from './Stub'
import { Expectation, ResponseDefinitionBuilder } from './StubTypes'

export abstract class StubBaseBuilder<
  Req,
  ResDef = any,
  ResDefBuilder extends ResponseDefinitionBuilder<ResDef> = any,
  S extends Stub<Req, ResDef> = Stub<Req, ResDef>
> {
  protected _id: string = ''
  protected _name: string = ''
  protected _priority: number = 0
  protected readonly _matchers: Array<Expectation<any, Req>> = []
  protected _responseDefinitionBuilder!: ResponseDefinitionBuilder<ResDef>
  protected _scenarioName: string = ''
  protected _scenarioRequiredState: string = ''
  protected _scenarioNewState: string = ''

  id(id: string): this {
    this._id = id
    return this
  }

  name(name: string): this {
    this._name = name
    return this
  }

  priority(priority: number): this {
    this._priority = priority
    return this
  }

  scenario(
    name: string,
    requiredState: string = SCENARIO_STATE_STARTED,
    newState: string = ''
  ): this {
    this._scenarioName = name
    this._scenarioRequiredState = requiredState
    this._scenarioNewState = newState

    this._matchers.push(this.spec(() => undefined, scenarioMatcher(name, requiredState, newState)))

    return this
  }

  abstract requestBody(...matcher: Array<Matcher<any>>): this

  reply(responseDefinitionBuilder: ResDefBuilder): this {
    this._responseDefinitionBuilder = responseDefinitionBuilder
    return this
  }

  abstract build(context: Context): S

  abstract validate(): void

  protected spec<T>(
    valueGetter: (request: Req) => T,
    matcher: Matcher<T>,
    weight: number = 0
  ): Expectation<T, Req> {
    return {
      matcher,
      valueGetter: valueGetter,
      weight
    }
  }
}
