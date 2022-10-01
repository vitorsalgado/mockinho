import { MatcherSpecification } from '@mockdog/core'
import { Mock } from '@mockdog/core'
import { MockSource } from '@mockdog/core'
import { ResponseDelegate } from './ResponseDelegate.js'

export class HttpMock extends Mock {
  public constructor(
    id: string,
    name: string,
    priority: number,
    source: MockSource,
    sourceDescription: string,
    matcherSpecifications: Array<MatcherSpecification<unknown, unknown>>,
    public readonly responseBuilder: ResponseDelegate,
  ) {
    super(id, name, priority, true, source, sourceDescription, matcherSpecifications, [], 0)
  }

  toString(): string {
    return `${this.name}{id:${this.id}, name:${this.name}, priority:${this.priority}, source:${this.source}, sourceDescription:${this.sourceDescription}`
  }
}
