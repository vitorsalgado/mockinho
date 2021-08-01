import { Readable } from 'stream'
import { v4 as UUId } from 'uuid'
import { Request, Response, NextFunction } from 'express'
import { findStubForRequest, FindStubResult, Stub } from '@mockinho/core'
import { HttpContext } from './HttpContext'
import { HttpRequest } from './HttpRequest'
import { HttpResponseDefinition, HttpStub } from './stub'
import { ExpressServerFactory } from './ExpressServerFactory'
import { ExpressConfigurations } from './config'
import { StubNotFoundError } from './StubNotFoundError'
import { BodyType } from './types'

export function findStubMiddleware(
  context: HttpContext<ExpressServerFactory, ExpressConfigurations>
): (request: Request, reply: Response, next: NextFunction) => Promise<void> {
  const verbose = context.provideConfigurations().verbose

  return async function async(
    request: Request,
    reply: Response,
    next: NextFunction
  ): Promise<void> {
    const req = fromExpressRequest(request)

    onRequestReceived(context, verbose, req)

    const result = findStubForRequest(req, context)

    if (result.hasMatch()) {
      const matched = result.matched()
      const response = matched.responseDefinition

      let body: BodyType

      if (response.body instanceof Readable) {
        const data = []
        let acc = 0

        for await (const chunk of response.body) {
          data.push(chunk)
          acc += chunk.length
        }

        if (response.body.readableEnded) {
          if (data.every(d => typeof d === 'string')) {
            body = Buffer.from(data.join('')).toString('utf-8')
          } else {
            body = Buffer.concat(data, acc)
          }
        }
      } else {
        body = response.body
      }

      const replier = () => reply.set(response.headers).status(response.status).send(body)

      if (response.hasDelay()) {
        setTimeout(replier, response.delay)
        return
      }

      onRequestMatched(context, verbose, req, response, matched)

      replier()

      return
    }

    onRequestNotMatched(context, req, result)

    return next(
      new StubNotFoundError(
        500,
        result
          .closestMatch()
          .map(x => [{ id: x.id, name: x.name, filename: x.sourceDescription }])
          .orValue([])
      )
    )
  }
}

function fromExpressRequest(request: Request): HttpRequest {
  ;(request as HttpRequest).id = UUId()
  ;(request as HttpRequest).href = `${request.protocol}://${request.hostname}${request.url}`

  return request as HttpRequest
}

// region Events

function onRequestNotMatched(
  context: HttpContext<ExpressServerFactory, ExpressConfigurations>,
  req: HttpRequest,
  result: FindStubResult<HttpRequest, HttpResponseDefinition>
) {
  context.emit('requestNotMatched', {
    url: req.url,
    method: req.method,
    closestMatch: result.closestMatch().orNothing() as HttpStub
  })
}

function onRequestMatched(
  context: HttpContext<ExpressServerFactory, ExpressConfigurations>,
  verbose: boolean,
  req: HttpRequest,
  response: HttpResponseDefinition,
  matched: Stub<HttpRequest, HttpResponseDefinition>
) {
  context.emit('requestMatched', {
    verbose: verbose,
    url: req.url,
    method: req.method,
    responseDefinition: response,
    stub: matched
  })
}

function onRequestReceived(
  context: HttpContext<ExpressServerFactory, ExpressConfigurations>,
  verbose: boolean,
  req: HttpRequest
) {
  context.emit('requestReceived', {
    verbose: verbose,
    method: req.method,
    url: req.url,
    body: req.body,
    headers: req.headers,
    href: req.href
  })
}

// endregion
