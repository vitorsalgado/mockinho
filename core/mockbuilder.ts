import { State } from './state.js'
import { Mock } from './mock.js'

export abstract class MockBuilder<MOCK extends Mock> {
  protected _id: string = ''
  protected _name: string = ''
  protected _priority: number = 0
  protected _scenario: string = ''
  protected _scenarioNewState: string = State.STATE_STARTED
  protected _scenarioRequiredState: string = ''

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

  scenario(name: string, requiredState: string = State.STATE_STARTED, newState: string = ''): this {
    this._scenario = name
    this._scenarioRequiredState = requiredState
    this._scenarioNewState = newState
    return this
  }

  abstract build(): MOCK
}
