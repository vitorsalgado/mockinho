import { Optional, StubInMemoryRepository } from '@mockinho/core'
import { HttpRequest } from '../HttpRequest'
import { HttpResponseDefinition } from './HttpResponseDefinition'
import { HttpStub } from './HttpStub'

export class HttpStubRepository extends StubInMemoryRepository<
  HttpRequest,
  HttpResponseDefinition,
  HttpStub
> {
  fetchById(id: string): Optional<HttpStub> {
    return super.fetchById(id)
  }
}
