import { MatcherSpecification, Mock, MockInMemoryRepository, MockSource } from '@mockdog/core'
import { Reply } from './reply/reply.js'

export class HttpMock extends Mock {
  constructor(
    id: string,
    name: string,
    priority: number,
    source: MockSource,
    sourceDescription: string,
    matcherSpecifications: Array<MatcherSpecification<unknown, unknown>>,
    public readonly reply: Reply,
  ) {
    super(id, name, priority, true, source, sourceDescription, matcherSpecifications, [], 0)
  }

  toString(): string {
    return `${this.name}{id:${this.id}, name:${this.name}, priority:${this.priority}, source:${this.source}, sourceDescription:${this.sourceDescription}`
  }
}

export class HttpMockRepository extends MockInMemoryRepository<HttpMock> {
  public constructor() {
    super()
  }
}
