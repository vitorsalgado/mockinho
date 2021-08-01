import { StubInMemoryRepository } from '@mockinho/core'
import { HttpRequest } from '../HttpRequest'
import { HttpResponseDefinition } from './HttpResponseDefinition'
import { HttpStub } from './HttpStub'

export class HttpStubRepository extends StubInMemoryRepository<
  HttpRequest,
  HttpResponseDefinition,
  HttpStub
> {}
