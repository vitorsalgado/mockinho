import { Readable } from 'stream'
import { NextFunction } from 'express'
import { Response } from 'express'
import { findMockForRequest } from '@mockdog/core'
import { FindMockResult } from '@mockdog/core'
import { modeIsAtLeast } from '@mockdog/core'
import { MediaTypes, H as H } from './http.js'
import { HttpContext } from './HttpContext.js'
import { SrvRequest } from './request.js'
import { SrvResponse, HttpMock } from './mock/index.js'

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
      if (response === null) {
        for (const { onMockServed } of result.results()) {
          if (onMockServed !== undefined) {
            onMockServed()
          }
        }

        matched.hit()

        return
      }

      const replier = () => {
        for (const cookie of response.cookiesToClear) {
          res.clearCookie(cookie.key, cookie.options)
        }

        for (const cookie of response.cookies) {
          res.cookie(cookie.key, cookie.value, cookie.options ?? {})
        }

        res.set(response.headers.toObject()).status(response.status)

        if (response.body instanceof Readable) {
          response.body.on('end', () => res.end())
          response.body.pipe(res)
        } else {
          res.send(response.body)
        }
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
  response: SrvResponse,
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
