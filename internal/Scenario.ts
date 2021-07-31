import { v4 as UUId } from 'uuid'

export const SCENARIO_STATE_STARTED = 'started'

export class Scenario {
  constructor(public readonly id: string, public readonly name: string, public state: string) {}

  static newScenario = (name: string): Scenario =>
    new Scenario(UUId(), name.toLowerCase(), SCENARIO_STATE_STARTED)

  isStarted(): boolean {
    return this.state === SCENARIO_STATE_STARTED
  }

  updateState(newState: string): void {
    this.state = newState
  }
}
