import { Expectation } from '@mockinho/core'
import { Mock } from '@mockinho/core'
import { MockSource } from '@mockinho/core'
import { MockScenario } from '@mockinho/core'
import { HttpResponseFixtureBuilderFunction } from './HttpResponseFixtureBuilder'

export class HttpMock extends Mock {
  public constructor(
    id: string,
    name: string,
    priority: number,
    source: MockSource,
    sourceDescription: string,
    expectations: Array<Expectation<unknown, unknown>>,
    public readonly responseBuilder: HttpResponseFixtureBuilderFunction,
    meta: Map<string, unknown>,
    properties: Map<string, unknown>,
    scenario?: MockScenario
  ) {
    super(
      id,
      name,
      priority,
      source,
      sourceDescription,
      expectations,
      0,
      meta,
      properties,
      scenario
    )
  }

  toString(): string {
    return `${this.name}{id:${this.id}, name:${this.name}, priority:${this.priority}, source:${this.source}, sourceDescription:${this.sourceDescription}`
  }
}
