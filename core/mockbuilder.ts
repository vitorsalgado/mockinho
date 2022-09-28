import { Matcher } from 'matchers'
import { MatcherSpecification } from './mock.js'
import { Scenario } from './scenario.js'
import { Mock } from './mock.js'

export abstract class MockBuilder<MOCK extends Mock> {
  protected _id: string = ''
  protected _name: string = ''
  protected _priority: number = 0
  protected _scenario: string = ''
  protected _scenarioNewState: string = ''
  protected _scenarioRequiredState: string = ''
  protected readonly _expectations: Array<MatcherSpecification<unknown, unknown>> = []

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

  newScenario(name: string, newState: string = ''): this {
    this._scenario = name
    this._scenarioRequiredState = newState
    return this
  }

  scenarioIs(name: string): this {
    this._scenario = name
    return this
  }

  scenarioStateIs(requiredState: string): this {
    this._scenarioRequiredState = requiredState
    return this
  }

  scenarioWillBe(newState: string): this {
    this._scenarioNewState = newState
    return this
  }

  scenario(
    name: string,
    requiredState: string = Scenario.STATE_STARTED,
    newState: string = '',
  ): this {
    this._scenario = name
    this._scenarioRequiredState = requiredState
    this._scenarioNewState = newState
    return this
  }

  abstract build(): MOCK

  protected spec<T, V>(
    target: string,
    valueSelector: (request: V) => T,
    matcher: Matcher<V>,
    weight: number = 0,
  ): MatcherSpecification<unknown, unknown> {
    return {
      target,
      matcher,
      selector: valueSelector,
      score: weight,
    } as MatcherSpecification<unknown, unknown>
  }
}
