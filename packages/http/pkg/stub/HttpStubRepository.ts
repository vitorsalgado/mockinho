import { StubInMemoryRepository } from '@mockinho/core'
import { HttpRequest } from '../HttpRequest'
import { HttpContext } from '../HttpContext'
import { HttpServerFactory } from '../HttpServer'
import { Configurations } from '../config'
import { HttpResponseDefinition } from './HttpResponseDefinition'
import { HttpStub } from './HttpStub'
import { HttpResponseDefinitionBuilder } from './HttpResponseDefinitionBuilder'

export class HttpStubRepository<
  SF extends HttpServerFactory,
  C extends Configurations<SF>
> extends StubInMemoryRepository<
  HttpContext<SF, C>,
  HttpRequest,
  HttpResponseDefinition,
  HttpResponseDefinitionBuilder<SF, C>,
  HttpStub<SF, C>
> {
  public constructor() {
    super()
  }
}
