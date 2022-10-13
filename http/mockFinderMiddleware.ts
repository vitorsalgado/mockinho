import { Readable } from 'stream'
import { NextFunction } from 'express'
import { Response } from 'express'
import { findMockForRequest } from '@mockdog/core'
import { FindMockResult } from '@mockdog/core'
import { modeIsAtLeast } from '@mockdog/core'
import { Media, H } from './http.js'
import { HttpContext } from './HttpContext.js'
import { HttpMock } from './mock.js'
import { SrvResponse } from './reply/index.js'
import { SrvRequest } from './request.js'
import { AppVars } from './vars.js'

export function mockFinderMiddleware(context: HttpContext) {
  const configurations = context.configuration
  const isVerbose = modeIsAtLeast(configurations, 'verbose')

  return async function (req: SrvRequest, res: Response, next: NextFunction): Promise<void> {
    const mocks = context.mockRepository.fetchSorted()
    const result = findMockForRequest<SrvRequest, HttpMock>(req, mocks)

    if (result.hasMatch()) {
      const matched = result.matched()
      const response = await matched.reply.build(req, res, { config: configurations })

      // response was handled by the replier
      if (response === null || response === undefined) {
        afterMockServed(matched, result)
        return
      }

      const replier = () => {
        for (const cookie of response.cookiesToClear) res.clearCookie(cookie.key, cookie.options)
        for (const cookie of response.cookies)
          res.cookie(cookie.key, cookie.value, cookie.options ?? {})

        const { status, headers } = response

        if (!response.trailers.isEmpty()) {
          let header = ''
          for (const [key] of response.trailers) {
            header += ' '
            header += key
          }

          headers.delete('Content-Length')
          headers.set('Transfer-Encoding', 'chunked')
          headers.set('Trailer', header.trim())
        }

        if (response.body === null || response.body === undefined) {
          if (
            status >= 200 &&
            status !== 204 &&
            status !== 304 &&
            req.method !== 'HEAD' &&
            response.trailers.isEmpty()
          ) {
            headers.set('content-length', '0')
          }

          writeHead(res, response)
          res.addTrailers(response.trailers.toObject())
          res.end(null)

          afterMockServed(matched, result)

          return
        }

        const requestContentType = req.header('content-type')
        const hasContentType =
          requestContentType !== undefined && response.headers.has('Content-Type')

        if (response.body instanceof Readable) {
          writeHead(res, response)
          response.body.on('end', () => {
            res.addTrailers(response.trailers.toObject())
            res.end(null)
          })

          response.body.pipe(res)
        } else {
          switch (typeof response.body) {
            case 'string':
              if (!hasContentType) {
                res.type('text')
              }

              writeHead(res, response)
              res.write(response.body)

              break

            case 'boolean':
            case 'number':
            case 'object':
              if (Buffer.isBuffer(response.body)) {
                if (!hasContentType) {
                  res.type('bin')
                }

                writeHead(res, response)
                res.write(response.body)
              } else {
                if (!hasContentType) {
                  res.type('json')
                }

                writeHead(res, response)
                res.write(JSON.stringify(response.body))
              }

              break
          }

          res.addTrailers(response.trailers.toObject())
          res.end(null)
        }

        afterMockServed(matched, result)
      }

      onRequestMatched(isVerbose, context, req, response, matched)

      if (response.hasDelay()) {
        setTimeout(replier, response.delay)
      } else {
        replier()
      }

      return
    }

    onRequestNotMatched(isVerbose, context, req, result)

    if (configurations.proxyEnabled) {
      return next()
    }

    res
      .set(H.ContentType, Media.PlainText)
      .status(AppVars.NoMatchStatus)
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

function writeHead(res: Response, response: SrvResponse) {
  if (response.statusMessage !== undefined) {
    res.writeHead(response.status, response.statusMessage, response.headers.toObject())
  } else {
    res.writeHead(response.status, response.headers.toObject())
  }
}

function afterMockServed(matched: HttpMock, result: FindMockResult<HttpMock>) {
  for (const { onMockServed } of result.results()) {
    if (onMockServed !== undefined) {
      onMockServed()
    }
  }

  matched.hit()
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
  response: SrvResponse,
  matched: HttpMock,
) {
  context.emit('onRequestMatched', {
    verbose,
    start: req.$internals.start,
    url: req.url,
    path: req.path,
    method: req.method,
    responseDefinition: response,
    mock: matched,
  })
}

// endregion
