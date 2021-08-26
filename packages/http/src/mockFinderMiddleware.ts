import { Readable } from 'stream'
import { Response, NextFunction } from 'express'
import HttpProxy from 'http-proxy'
import { findMockForRequest } from '@mockinho/core'
import { FindMockResult } from '@mockinho/core'
import { HttpContext } from './HttpContext'
import { HttpRequest } from './HttpRequest'
import { HttpResponseFixture, HttpMock } from './mock'
import { BodyType } from './types'
import { Headers } from './types'
import { MediaTypes } from './types'
import { HttpConfiguration } from './config'

export function mockFinderMiddleware(
  context: HttpContext
): (request: HttpRequest, reply: Response, next: NextFunction) => Promise<void> {
  const configurations = context.configuration
  const verbose = configurations.isVerbose
  const proxy = HttpProxy.createProxyServer()

  return async function (req: HttpRequest, res: Response, next: NextFunction): Promise<void> {
    proxy.removeAllListeners()

    onRequestReceived(context, verbose, req)

    const result = findMockForRequest<HttpRequest, HttpConfiguration, HttpMock>(req, context)

    if (result.hasMatch()) {
      const matched = result.matched()
      const response = await matched.responseBuilder(context, req, matched)

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

        proxy.web(req, res, { target: response.proxyTo })

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
        response.cookiesToClear.forEach(cookie => res.clearCookie(cookie.key, cookie.options))
        response.cookies.forEach(cookie =>
          res.cookie(cookie.key, cookie.value, cookie.options ?? {})
        )

        res.set(response.headers).status(response.status).send(body)
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

    if (configurations.isProxyEnabled) {
      return next()
    }

    res
      .set(Headers.ContentType, MediaTypes.TEXT_PLAIN)
      .status(500)
      .send(
        `Request was not matched.${result
          .closestMatch()
          .map(() => ' See closest matches below:')
          .orValue('')}` +
          result
            .closestMatch()
            .map(x => [{ id: x.id, name: x.name, filename: x.sourceDescription }])
            .orValue([])
            .map(item => `\nName: ${item.name}\nId: ${item.id}\nFile: ${item.filename}`)
            .join('')
      )
  }
}

// region Events

function onRequestNotMatched(
  context: HttpContext,
  req: HttpRequest,
  result: FindMockResult<HttpMock>
) {
  context.emit('requestNotMatched', {
    url: req.url,
    method: req.method,
    closestMatch: result.closestMatch().orNothing() as HttpMock
  })
}

function onRequestMatched(
  context: HttpContext,
  verbose: boolean,
  req: HttpRequest,
  response: HttpResponseFixture,
  matched: HttpMock
) {
  context.emit('requestMatched', {
    verbose: verbose,
    start: req.start,
    url: req.url,
    method: req.method,
    responseDefinition: response,
    mock: matched
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
