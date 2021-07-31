import { Stub, StubScenario } from '../../../internal/Stub'
import { Expectation, StubSource } from '../../../internal/StubTypes'
import { HttpRequest } from '../HttpRequest'
import { HttpResponseDefinition } from './HttpResponseDefinition'

export interface HttpStubMeta {
  url?: string
  method?: string
}

export class HttpStub extends Stub<HttpRequest, HttpResponseDefinition> {
  constructor(
    id: string,
    name: string,
    priority: number,
    source: StubSource,
    sourceDescription: string,
    expectations: Array<Expectation<any, HttpRequest>>,
    responseDefinition: HttpResponseDefinition,
    public readonly meta: HttpStubMeta,
    scenario?: StubScenario
  ) {
    super(
      id,
      name,
      priority,
      source,
      sourceDescription,
      expectations,
      responseDefinition,
      0,
      scenario
    )
  }

  toString(): string {
    return `HttpStub{id:${this.id}, name:${this.name}, priority:${this.priority}, source:${this.source}, sourceDescription:${this.sourceDescription}`
  }
}
