import { FastifyReply, FastifyRequest } from 'fastify'
import { v4 as UUId } from 'uuid'
import { findStubForRequest } from '../../internal/findStubForRequest'
import { FindStubResult } from '../../internal/FindStubResult'
import { Stub } from '../../internal/Stub'
import { FastifyConfigurations } from './config/FastifyConfigurations'
import { FastifyHttpServerFactory } from './FastifyHttpServerFactory'
import { HttpContext } from './HttpContext'
import { HttpRequest } from './HttpRequest'
import { HttpResponseDefinition, HttpStub } from './stub'
import { ErrorCodes } from './types'

export class FastifyRequestHandler {
  private readonly verbose: boolean

  constructor(
    private readonly context: HttpContext<FastifyHttpServerFactory, FastifyConfigurations>
  ) {
    this.verbose = context.provideConfigurations().verbose
  }

  async handle(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const req = FastifyRequestHandler.fromFastifyRequest(request)

    this.onRequestReceived(req)

    if (req.isMultipart()) {
      await FastifyRequestHandler.handleMultiPart(req)
    }

    const result = findStubForRequest(req, this.context)

    if (result.hasMatch()) {
      const matched = result.matched()
      const response = matched.responseDefinition

      const replier = () =>
        reply.status(response.status).headers(response.headers).send(response.body)

      if (response.hasDelay()) {
        setTimeout(replier, response.delay)
        return
      }

      this.onRequestMatched(req, response, matched)

      return replier()
    }

    this.onRequestNotMatched(req, result)

    return reply.status(500).send({
      error: 'No stub found!',
      code: ErrorCodes.MR_NO_STUB_FOUND,
      closestMatches: result
        .closestMatch()
        .map(x => [{ id: x.id, name: x.name, filename: x.sourceDescription }])
        .orValue([])
    })
  }

  private static async handleMultiPart(req: HttpRequest): Promise<void> {
    for await (const part of req.parts()) {
      if (part.file) {
        // eslint-disable-next-line no-empty-pattern
        for await (const {} of part.file) {
          // ...
        }
      }
    }
  }

  private static fromFastifyRequest(request: FastifyRequest): HttpRequest {
    request.id = UUId()
    ;(request as HttpRequest).href = `${request.protocol}://${request.hostname}${request.url}`

    return request as HttpRequest
  }

  // region Events

  private onRequestNotMatched(
    req: HttpRequest,
    result: FindStubResult<HttpRequest, HttpResponseDefinition>
  ) {
    this.context.emit('requestNotMatched', {
      url: req.url,
      method: req.method,
      closestMatch: result.closestMatch().orNothing() as HttpStub
    })
  }

  private onRequestMatched(
    req: HttpRequest,
    response: HttpResponseDefinition,
    matched: Stub<HttpRequest, HttpResponseDefinition>
  ) {
    this.context.emit('requestMatched', {
      verbose: this.verbose,
      url: req.url,
      method: req.method,
      responseDefinition: response,
      stub: matched
    })
  }

  private onRequestReceived(req: HttpRequest) {
    this.context.emit('requestReceived', {
      verbose: this.verbose,
      method: req.method,
      url: req.url,
      body: req.body,
      headers: req.headers,
      href: req.href
    })
  }

  // endregion
}
