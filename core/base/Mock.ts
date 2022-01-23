import { v4 as UUIdV4 } from 'uuid'
import { Expectation } from './Expectation.js'
import { MockSource } from './MockSource.js'
import { ExpectationWithContext } from './ExpectationWithContext.js'
import { Configuration } from './Configuration.js'

export class Mock {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly priority: number,
    public readonly source: MockSource,
    public readonly sourceDescription: string,
    public readonly expectations: Array<Expectation<unknown, unknown>>,
    private readonly _statefulExpectations: Array<ExpectationWithContext<unknown, unknown>>,
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

  statefulExpectations<MOCK extends Mock, CONFIG extends Configuration>(): Array<
    ExpectationWithContext<unknown, unknown, MOCK, CONFIG>
  > {
    return [...this._statefulExpectations] as unknown as Array<
      ExpectationWithContext<unknown, unknown, MOCK, CONFIG>
    >
  }
}
