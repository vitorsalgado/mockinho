import { Expectation } from '@mockinho/core'
import { Mock } from '@mockinho/core'
import { MockSource } from '@mockinho/core'
import { StatefulExpectation } from '@mockinho/core/dist/base/StatefulExpectation'
import { HttpResponseFixtureBuilderFunction } from './HttpResponseFixtureBuilder'

export class HttpMock extends Mock {
  public constructor(
    id: string,
    name: string,
    priority: number,
    source: MockSource,
    sourceDescription: string,
    expectations: Array<Expectation<unknown, unknown>>,
    statefulExpectations: Array<StatefulExpectation<unknown, unknown>>,
    public readonly responseBuilder: HttpResponseFixtureBuilderFunction,
    meta: Map<string, unknown>,
    properties: Map<string, unknown>
  ) {
    super(
      id,
      name,
      priority,
      source,
      sourceDescription,
      expectations,
      statefulExpectations,
      0,
      meta,
      properties
    )
  }

  toString(): string {
    return `${this.name}{id:${this.id}, name:${this.name}, priority:${this.priority}, source:${this.source}, sourceDescription:${this.sourceDescription}`
  }
}