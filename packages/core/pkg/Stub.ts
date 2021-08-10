import { v4 as UUIdV4 } from 'uuid'
import { Expectation, StubSource } from './StubTypes'
import { ResponseDefinitionBuilder } from './ResponseDefinitionBuilder'
import { Context } from './Context'

export interface StubScenario {
  readonly name: string
  readonly requiredState: string
  readonly newState: string
}

export class Stub<
  Ctx extends Context,
  Req,
  Res,
  ResponseBuilder extends ResponseDefinitionBuilder<Ctx, Req, Res>
> {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly priority: number,
    public readonly source: StubSource,
    public readonly sourceDescription: string,
    public readonly expectations: Array<Expectation<any, Req>>,
    public readonly responseDefinitionBuilder: ResponseBuilder,
    private hits: number,
    public readonly meta: Map<string, unknown>,
    public readonly properties: Map<string, unknown>,
    public readonly scenario?: StubScenario
  ) {
    if (!this.id) {
      this.id = UUIdV4()
    }
  }

  static newStub<
    Ctx extends Context,
    Req,
    Res,
    ResponseBuilder extends ResponseDefinitionBuilder<Ctx, Req, Res>
  >(
    id: string,
    name: string,
    priority: number,
    expectations: Array<Expectation<any, Req>>,
    responseDefinition: ResponseBuilder,
    source: StubSource,
    sourceDescription: string,
    meta: Map<string, unknown>,
    properties: Map<string, unknown>,
    scenario?: StubScenario
  ): Stub<Ctx, Req, Res, ResponseBuilder> {
    id = id === '' ? UUIdV4() : id
    return new Stub<Ctx, Req, Res, ResponseBuilder>(
      id,
      name,
      priority,
      source,
      sourceDescription,
      expectations,
      responseDefinition,
      0,
      meta,
      properties,
      scenario
    )
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
