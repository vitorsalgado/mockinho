import { Expectation, Stub, StubScenario, StubSource } from '@mockinho/core'
import { HttpRequest } from '../HttpRequest'
import { HttpContext } from '../HttpContext'
import { HttpResponseDefinition } from './HttpResponseDefinition'
import { HttpResponseDefinitionBuilder } from './HttpResponseDefinitionBuilder'

export class HttpStub extends Stub<
  HttpContext,
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
    meta: Map<string, unknown>,
    scenario?: StubScenario
  ) {
    super(
      id,
      name,
      priority,
      source,
      sourceDescription,
      expectations,
      responseBuilder,
      0,
      meta,
      scenario
    )
  }

  toString(): string {
    return `HttpStub{id:${this.id}, name:${this.name}, priority:${this.priority}, source:${this.source}, sourceDescription:${this.sourceDescription}`
  }
}
