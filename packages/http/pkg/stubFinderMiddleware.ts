import { Readable } from 'stream'
import { v4 as UUId } from 'uuid'
import { Request, Response, NextFunction } from 'express'
import HttpProxy from 'http-proxy'
import { findStubForRequest, FindStubResult, Stub } from '@mockinho/core'
import { HttpContext } from './HttpContext'
import { HttpRequest } from './HttpRequest'
import { HttpResponseDefinition, HttpStub, HttpResponseDefinitionBuilder } from './stub'
import { ExpressConfigurations } from './config'
import { BodyType } from './types'
import { nowInMs } from './utils'

export function stubFinderMiddleware(
  context: HttpContext
): (request: Request, reply: Response, next: NextFunction) => Promise<void> {
  const verbose = context.provideConfigurations().verbose
  const proxy = HttpProxy.createProxyServer()

  return async function (request: Request, reply: Response, next: NextFunction): Promise<void> {
    proxy.removeAllListeners()

    const req = fromExpressRequest(request)

    onRequestReceived(context, verbose, req)

    const result = findStubForRequest<
      HttpContext,
      HttpRequest,
      HttpResponseDefinition,
      HttpResponseDefinitionBuilder,
      ExpressConfigurations
    >(req, context)

    if (result.hasMatch()) {
      req.matched = true
      req.matchResult = result

      const matched = result.matched()
      const response = matched.responseDefinitionBuilder.build(context, req)

      if (response.proxyTo) {
        proxy.once('error', err => next(err))
        proxy.once('proxyReq', proxyReq =>
          Object.entries(response.proxyHeaders).forEach(([name, value]) =>
            proxyReq.setHeader(name, value)
          )
        )
        proxy.once('proxyRes', proxyRes => {
          for (const [name, value] of Object.entries(response.headers)) {
            proxyRes.headers[name] = value
          }
          proxyRes.on('end', () => proxy.removeAllListeners())
        })

        proxy.web(req, reply, { target: response.proxyTo })

        return
      }

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

      const replier = () => {
        response.cookiesToClear.forEach(cookie => reply.clearCookie(cookie.key, cookie.options))
        response.cookies.forEach(cookie =>
          reply.cookie(cookie.key, cookie.value, cookie.options ?? {})
        )

        reply.set(response.headers).status(response.status).send(body)
      }

      if (response.hasDelay()) {
        setTimeout(replier, response.delay)
        return
      }

      onRequestMatched(context, verbose, req, response, matched)
      replier()

      return
    }

    onRequestNotMatched(context, req, result)

    return next(result)
  }
}

function fromExpressRequest(request: Request & { [key: string]: any }): HttpRequest {
  request.id = UUId()
  request.href = `${request.protocol}://${request.hostname}${request.url}`
  request.matched = false
  request.start = nowInMs()

  return request as HttpRequest
}

// region Events

function onRequestNotMatched(
  context: HttpContext,
  req: HttpRequest,
  result: FindStubResult<
    HttpContext,
    HttpRequest,
    HttpResponseDefinition,
    HttpResponseDefinitionBuilder
  >
) {
  context.emit('requestNotMatched', {
    url: req.url,
    method: req.method,
    closestMatch: result.closestMatch().orNothing() as HttpStub
  })
}

function onRequestMatched(
  context: HttpContext,
  verbose: boolean,
  req: HttpRequest,
  response: HttpResponseDefinition,
  matched: Stub<HttpContext, HttpRequest, HttpResponseDefinition, HttpResponseDefinitionBuilder>
) {
  context.emit('requestMatched', {
    verbose: verbose,
    start: req.start,
    url: req.url,
    method: req.method,
    responseDefinition: response,
    stub: matched
  })
}

function onRequestReceived(context: HttpContext, verbose: boolean, req: HttpRequest) {
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
