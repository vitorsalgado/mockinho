import { v4 as UUIdV4 } from 'uuid'
import { Expectation } from './Expectation'
import { MockSource } from './MockSource'

export interface MockScenario {
  readonly name: string
  readonly requiredState: string
  readonly newState: string
}

export class Mock {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly priority: number,
    public readonly source: MockSource,
    public readonly sourceDescription: string,
    public readonly expectations: Array<Expectation<unknown, unknown>>,
    private hits: number,
    public readonly meta: Map<string, unknown>,
    public readonly properties: Map<string, unknown>,
    public readonly scenario?: MockScenario
  ) {
    if (!this.id) {
      this.id = UUIdV4()
    }
  }

  hit(): void {
    this.hits++
  }

  totalHits(): number {
    return this.hits
  }

  hasBeenCalled(): boolean {
    return this.hits > 0
  }

  getProperty<T>(key: string): T {
    return this.properties.get(key) as T
  }

  saveProperty<T>(key: string, value: T): T {
    this.properties.set(key, value)
    return value
  }

  removeProperty(key: string): void {
    this.properties.delete(key)
  }
}
