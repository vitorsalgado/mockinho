import { Mock } from '@mockdog/core'
import { MockSource } from '@mockdog/core'
import { ExpectationWithContext } from '@mockdog/core'
import { Expectation } from '@mockdog/core'
import { ResponseBuilderDelegate } from './ResponseBuilderDelegate'
import { Response } from './Response'

export class RpcMock extends Mock {
  private readonly _responseBuilder: ResponseBuilderDelegate<Response>

  public constructor(
    id: string,
    name: string,
    priority: number,
    source: MockSource,
    sourceDescription: string,
    expectations: Array<Expectation<unknown, unknown>>,
    statefulExpectations: Array<ExpectationWithContext<unknown, unknown>>,
    responseBuilder: ResponseBuilderDelegate<Response>,
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

    this._responseBuilder = responseBuilder
  }

  responseBuilder<R extends Response = Response>(): ResponseBuilderDelegate<R> {
    return this._responseBuilder as ResponseBuilderDelegate<R>
  }

  toString(): string {
    return `${this.name}{id:${this.id}, name:${this.name}, priority:${this.priority}, source:${this.source}, sourceDescription:${this.sourceDescription}`
  }
}
