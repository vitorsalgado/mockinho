import { v4 as UUId } from 'uuid'

export class Scenario {
  public readonly id: string
  public readonly name: string
  private state: string

  constructor(id: string, name: string, state: string) {
    this.id = id
    this.name = name
    this.state = state
  }

  static newScenario = (name: string): Scenario =>
    new Scenario(UUId(), name.toLowerCase(), Scenario.STATE_STARTED)

  static STATE_STARTED = 'started'

  isStarted(): boolean {
    return this.state === Scenario.STATE_STARTED
  }

  currentState(): string {
    return this.state
  }

  updateState(newState: string): void {
    this.state = newState
  }
}
