import crypto from 'crypto'
import { Matcher, matcherHint, res } from '@mockdog/matchers'
import { Optional } from '@mockdog/x'

export class State {
  public readonly id: string
  public readonly name: string
  private state: string

  constructor(id: string, name: string, state: string) {
    this.id = id
    this.name = name
    this.state = state
  }

  static newStateMachine = (name: string): State =>
    new State(crypto.randomUUID(), name.toLowerCase(), State.STATE_STARTED)

  static STATE_STARTED = 'started'

  isStarted(): boolean {
    return this.state === State.STATE_STARTED
  }

  currentState(): string {
    return this.state
  }

  updateState(newState: string): void {
    this.state = newState
  }
}

export class StateRepository {
  private readonly states = new Map<string, State>()

  fetchByName(name: string): Optional<State> {
    return Optional.ofNullable(this.states.get(name.toLowerCase()))
  }

  fetchAll(): Array<State> {
    return [...this.states.values()]
  }

  save(scenario: State): State {
    this.states.set(scenario.name, scenario)
    return scenario
  }

  createNewIfNeeded(name: string): State {
    const normalizedName = name.toLowerCase()
    const entry = this.states.get(normalizedName)

    if (entry) {
      return entry
    }

    return this.save(State.newStateMachine(normalizedName))
  }
}

export const stateMatcher =
  (repository: StateRepository) =>
  (
    name: string,
    requiredState: string = State.STATE_STARTED,
    newState: string = '',
  ): Matcher<void> => {
    const matcherName = 'state'
    const msg = () =>
      matcherHint(matcherName, name) +
      `\nRequired state: ${requiredState}` +
      `\nNew state: ${newState}`

    if (requiredState === State.STATE_STARTED) {
      repository.createNewIfNeeded(name)
    }

    return () => {
      const opt = repository.fetchByName(name)

      if (opt.isEmpty()) {
        // No state present, just continue
        return res(matcherName, msg, true)
      }

      const state = opt.get()

      if (state.currentState() === requiredState) {
        const result = res(matcherName, msg, true)

        if (newState) {
          result.onMockServed = () => {
            state.updateState(newState)
            repository.save(state)
          }
        }

        return result
      } else {
        return res(matcherName, msg, false)
      }
    }
  }
