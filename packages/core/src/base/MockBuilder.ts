import { SCENARIO_STATE_STARTED } from '../builtin/scenario'
import { scenarioMatcher } from '../builtin/scenario'
import { Matcher } from './Matcher'
import { Expectation } from './Expectation'

export abstract class MockBuilder {
  protected _id: string = ''
  protected _name: string = ''
  protected _priority: number = 0
  protected readonly _matchers: Array<Expectation<unknown, unknown>> = []
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

  abstract validate(): void

  protected spec<T, V>(
    valueGetter: (request: V) => T,
    matcher: Matcher<T>,
    weight: number = 0,
    container: string = 'request'
  ): Expectation<unknown, unknown> {
    return {
      matcher,
      valueGetter,
      container,
      weight
    } as Expectation<unknown, unknown>
  }
}
