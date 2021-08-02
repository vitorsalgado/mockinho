import { Expectation, Stub, StubScenario, StubSource } from '@mockinho/core'
import { HttpRequest } from '../HttpRequest'
import { HttpContext } from '../HttpContext'
import { ExpressServerFactory } from '../ExpressServerFactory'
import { ExpressConfigurations } from '../config'
import { HttpResponseDefinitionBuilder } from './HttpResponseDefinitionBuilder'
import { HttpResponseDefinition } from './HttpResponseDefinition'

export interface HttpStubMeta {
  url?: string
  method?: string
}

export class HttpStub extends Stub<
  HttpContext<ExpressServerFactory, ExpressConfigurations>,
  HttpRequest,
  HttpResponseDefinition,
  HttpResponseDefinitionBuilder
> {
  constructor(
    id: string,
    name: string,
    priority: number,
    source: StubSource,
    sourceDescription: string,
    expectations: Array<Expectation<any, HttpRequest>>,
    responseBuilder: HttpResponseDefinitionBuilder,
    public readonly meta: HttpStubMeta,
    scenario?: StubScenario
  ) {
    super(id, name, priority, source, sourceDescription, expectations, responseBuilder, 0, scenario)
  }

  toString(): string {
    return `HttpStub{id:${this.id}, name:${this.name}, priority:${this.priority}, source:${this.source}, sourceDescription:${this.sourceDescription}`
  }
}
