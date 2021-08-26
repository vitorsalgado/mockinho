import { v4 as UUIdV4 } from 'uuid'
import { Expectation } from './Expectation'
import { MockSource } from './MockSource'
import { StatefulExpectation } from './StatefulExpectation'

export class Mock {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly priority: number,
    public readonly source: MockSource,
    public readonly sourceDescription: string,
    public readonly expectations: Array<Expectation<unknown, unknown>>,
    public readonly statefulExpectations: Array<StatefulExpectation<unknown, unknown>>,
    public hits: number,
    public readonly meta: Map<string, unknown>,
    public readonly properties: Map<string, unknown>
  ) {
    if (!this.id) {
      this.id = UUIdV4()
    }
  }

  hit(): void {
    this.hits++
  }

  hasBeenCalled(): boolean {
    return this.hits > 0
  }
}
