import { Expectation } from '@mockdog/core'
import { Mock } from '@mockdog/core'
import { MockSource } from '@mockdog/core'
import { ExpectationWithContext } from '@mockdog/core'
import { HttpConfiguration } from '../config'
import { ResponseDelegate } from './ResponseDelegate'

export class HttpMock extends Mock {
  public constructor(
    id: string,
    name: string,
    priority: number,
    source: MockSource,
    sourceDescription: string,
    expectations: Array<Expectation<unknown, unknown>>,
    statefulExpectations: Array<
      ExpectationWithContext<unknown, unknown, HttpMock, HttpConfiguration>
    >,
    public readonly responseBuilder: ResponseDelegate,
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
      statefulExpectations as Array<ExpectationWithContext<unknown, unknown>>,
      0,
      meta,
      properties
    )
  }

  toString(): string {
    return `${this.name}{id:${this.id}, name:${this.name}, priority:${this.priority}, source:${this.source}, sourceDescription:${this.sourceDescription}`
  }
}
