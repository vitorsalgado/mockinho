import { Readable } from 'stream'
import { NextFunction } from 'express'
import { Response } from 'express'
import HttpProxy from 'http-proxy'
import { findMockForRequest } from '@mockdog/core'
import { FindMockResult } from '@mockdog/core'
import { modeIsAtLeast } from '@mockdog/core'
import { HttpContext } from './HttpContext.js'
import { HttpRequest } from './HttpRequest.js'
import { ResponseFixture, HttpMock } from './mock/index.js'
import { HttpConfiguration } from './config/index.js'
import { MediaTypes } from './MediaTypes.js'
import { Headers } from './Headers.js'
import { BodyType } from './BodyType.js'

export function mockFinderMiddleware(
  context: HttpContext
): (request: HttpRequest, reply: Response, next: NextFunction) => Promise<void> {
  const configurations = context.configuration
  const isVerbose = modeIsAtLeast(configurations, 'verbose')
  const proxy = HttpProxy.createProxyServer()

  return async function (req: HttpRequest, res: Response, next: NextFunction): Promise<void> {
    proxy.removeAllListeners()

    const result = findMockForRequest<HttpRequest, HttpMock, HttpConfiguration>(req, context)

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
        const data: Array<string | unknown> = []
        let acc = 0

        for await (const chunk of response.body) {
          data.push(chunk)
          acc += chunk.length
        }

        if (response.body.readableEnded) {
          if (data.every(d => typeof d === 'string')) {
            body = Buffer.from(data.join('')).toString('utf-8')
          } else {
            body = Buffer.concat(data as unknown as Uint8Array[], acc)
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

      onRequestMatched(isVerbose, context, req, response, matched)
      replier()

      return
    }

    onRequestNotMatched(isVerbose, context, req, result)

    if (configurations.proxyEnabled) {
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
  verbose: boolean,
  context: HttpContext,
  req: HttpRequest,
  result: FindMockResult<HttpMock>
) {
  context.emit('onRequestNotMatched', {
    verbose,
    url: req.url,
    path: req.path,
    method: req.method,
    closestMatch: result.closestMatch().orNothing() as HttpMock
  })
}

function onRequestMatched(
  verbose: boolean,
  context: HttpContext,
  req: HttpRequest,
  response: ResponseFixture,
  matched: HttpMock
) {
  context.emit('onRequestMatched', {
    verbose,
    start: req.start,
    url: req.url,
    path: req.path,
    method: req.method,
    responseDefinition: response,
    mock: matched
  })
}

// endregion
