import { StubInMemoryRepository } from '@mockinho/core'
import { HttpRequest } from '../HttpRequest'
import { HttpContext } from '../HttpContext'
import { HttpResponseDefinition } from './HttpResponseDefinition'
import { HttpStub } from './HttpStub'
import { HttpResponseDefinitionBuilder } from './HttpResponseDefinitionBuilder'

export class HttpStubRepository extends StubInMemoryRepository<
  HttpContext,
  HttpRequest,
  HttpResponseDefinition,
  HttpResponseDefinitionBuilder,
  HttpStub
> {
  public constructor() {
    super()
  }
}
