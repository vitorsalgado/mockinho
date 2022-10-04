import http from 'node:http'
import { Readable } from 'stream'
import { NextFunction } from 'express'
import { Response } from 'express'
import { findMockForRequest } from '@mockdog/core'
import { FindMockResult } from '@mockdog/core'
import { modeIsAtLeast } from '@mockdog/core'
import { BodyType, MediaTypes, Headers as H } from './http.js'
import { HttpContext } from './HttpContext.js'
import { SrvRequest } from './request.js'
import { ResponseFixture, HttpMock } from './mock/index.js'

export function mockFinderMiddleware(context: HttpContext) {
  const configurations = context.configuration
  const isVerbose = modeIsAtLeast(configurations, 'verbose')

  return async function (req: SrvRequest, res: Response, next: NextFunction): Promise<void> {
    const mocks = context.mockRepository.fetchSorted()
    const result = findMockForRequest<SrvRequest, HttpMock>(req, mocks)

    if (result.hasMatch()) {
      const matched = result.matched()
      const response = await matched.responseBuilder(context, req, matched)

      if (response.proxyTo) {
        const h = req.headers
        const u = new URL(response.proxyTo)

        Object.entries(response.proxyHeaders).forEach(([name, value]) => (h[name] = value))

        const options: http.RequestOptions = {
          port: u.port,
          host: u.hostname,
          path: req.url,
          method: req.method,
          headers: h,
        }

        const proxy = http.request(options, function (m) {
          for (const [name, value] of Object.entries(m.headers)) {
            res.header(name, value)
          }

          for (const [name, value] of Object.entries(response.headers)) {
            res.header(name, value)
          }

          res.writeHead(response.status)

          m.on('data', chunk => res.write(chunk))
          m.on('close', () => res.end())
          m.on('end', () => res.end())
        })

        proxy.on('data', chunk => res.write(chunk))
        proxy.on('close', () => res.end())
        proxy.on('end', () => res.end())

        proxy.write(req.rawBody)
        proxy.end()

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
          res.cookie(cookie.key, cookie.value, cookie.options ?? {}),
        )

        res.set(response.headers).status(response.status).send(body)
      }

      for (const { onMockServed } of result.results()) {
        if (onMockServed !== undefined) {
          onMockServed()
        }
      }

      onRequestMatched(isVerbose, context, req, response, matched)

      if (response.hasDelay()) {
        setTimeout(replier, response.delay)
      } else {
        replier()
      }

      matched.hit()

      return
    }

    onRequestNotMatched(isVerbose, context, req, result)

    if (configurations.proxyEnabled) {
      return next()
    }

    res
      .set(H.ContentType, MediaTypes.TEXT_PLAIN)
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
            .join(''),
      )
  }
}

// region Events

function onRequestNotMatched(
  verbose: boolean,
  context: HttpContext,
  req: SrvRequest,
  result: FindMockResult<HttpMock>,
) {
  context.emit('onRequestNotMatched', {
    verbose,
    url: req.url,
    path: req.path,
    method: req.method,
    closestMatch: result.closestMatch().orNothing() as HttpMock,
  })
}

function onRequestMatched(
  verbose: boolean,
  context: HttpContext,
  req: SrvRequest,
  response: ResponseFixture,
  matched: HttpMock,
) {
  context.emit('onRequestMatched', {
    verbose,
    start: req.start,
    url: req.url,
    path: req.path,
    method: req.method,
    responseDefinition: response,
    mock: matched,
  })
}

// endregion
