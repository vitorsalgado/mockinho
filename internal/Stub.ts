import { v4, v4 as UUId } from 'uuid'
import { Expectation, StubSource } from './StubTypes'

export interface StubScenario {
  readonly name: string
  readonly requiredState: string
  readonly newState: string
}

export class Stub<Req, ResDef = any> {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly priority: number,
    public readonly source: StubSource,
    public readonly sourceDescription: string,
    public readonly expectations: Array<Expectation<any, Req>>,
    public readonly responseDefinition: ResDef,
    private hits: number,
    public readonly scenario?: StubScenario
  ) {
    if (!this.id) {
      this.id = v4()
    }
  }

  static newStub<Req, ResDef>(
    id: string,
    name: string,
    priority: number,
    expectations: Array<Expectation<any, Req>>,
    responseDefinition: ResDef,
    source: StubSource,
    sourceDescription: string,
    scenario?: StubScenario
  ): Stub<Req, ResDef> {
    id = id === '' ? UUId() : id
    return new Stub(id, name, priority, 'code', '', expectations, responseDefinition, 0, scenario)
  }

  hit(): void {
    this.hits++
  }

  totalHits(): number {
    return this.hits
  }

  called(): boolean {
    return this.hits > 0
  }
}
