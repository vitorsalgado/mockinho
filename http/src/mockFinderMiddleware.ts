import { Readable } from 'stream'
import { NextFunction } from 'express'
import { Response } from 'express'
import HttpProxy from 'http-proxy'
import { findMockForRequest } from '@mockinho/core'
import { FindMockResult } from '@mockinho/core'
import { HttpContext } from './HttpContext'
import { HttpRequest } from './HttpRequest'
import { ResponseFixture, HttpMock } from './mock'
import { Configuration } from './config'
import { MediaTypes } from './MediaTypes'
import { Headers } from './Headers'
import { BodyType } from '.'

export function mockFinderMiddleware(
  context: HttpContext
): (request: HttpRequest, reply: Response, next: NextFunction) => Promise<void> {
  const configurations = context.configuration
  const isVerbose = configurations.modeIsAtLeast('verbose')
  const proxy = HttpProxy.createProxyServer()

  return async function (req: HttpRequest, res: Response, next: NextFunction): Promise<void> {
    proxy.removeAllListeners()

    const result = findMockForRequest<HttpRequest, Configuration, HttpMock>(req, context)

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

      onRequestMatched(context, isVerbose, req, response, matched)
      replier()

      return
    }

    onRequestNotMatched(context, req, result)

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
  context: HttpContext,
  req: HttpRequest,
  result: FindMockResult<HttpMock>
) {
  context.emit('onRequestNotMatched', {
    url: req.url,
    path: req.path,
    method: req.method,
    closestMatch: result.closestMatch().orNothing() as HttpMock
  })
}

function onRequestMatched(
  context: HttpContext,
  verbose: boolean,
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
