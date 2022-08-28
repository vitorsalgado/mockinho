import { Matcher } from './Matcher.js'
import { Expectation } from './Expectation.js'
import { Scenario } from './Scenario.js'
import { ExpectationWithContext } from './ExpectationWithContext.js'
import { scenarioMatcher } from './scenarioMatcher.js'
import { Mock } from './Mock.js'

export abstract class MockBuilder<MOCK extends Mock> {
  protected _id: string = ''
  protected _name: string = ''
  protected _priority: number = 0
  protected readonly _statefulExpectations: Array<ExpectationWithContext<unknown, unknown, MOCK>> =
    []

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
    return this.scenario(name, Scenario.STATE_STARTED, newState)
  }

  scenario(
    name: string,
    requiredState: string = Scenario.STATE_STARTED,
    newState: string = '',
  ): this {
    this._statefulExpectations.push({
      valueGetter: () => undefined,
      matcherContext: scenarioMatcher(name, requiredState, newState),
    })

    return this
  }

  abstract build(): MOCK

  protected spec<T, V>(
    valueGetter: (request: V) => T,
    matcher: Matcher<T>,
    weight: number = 0,
  ): Expectation<unknown, unknown> {
    return {
      matcher,
      valueGetter,
      weight,
    } as Expectation<unknown, unknown>
  }
}
