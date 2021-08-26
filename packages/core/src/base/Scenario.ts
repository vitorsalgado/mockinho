import { v4 as UUId } from 'uuid'

export class Scenario {
  constructor(public readonly id: string, public readonly name: string, public state: string) {}

  static newScenario = (name: string): Scenario =>
    new Scenario(UUId(), name.toLowerCase(), Scenario.STATE_STARTED)

  static STATE_STARTED = 'started'

  isStarted(): boolean {
    return this.state === Scenario.STATE_STARTED
  }

  updateState(newState: string): void {
    this.state = newState
  }
}
