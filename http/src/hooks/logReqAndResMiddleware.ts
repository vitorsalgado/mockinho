import { Response } from 'express'
import { NextFunction } from 'express'
import { Request } from 'express'
import { nowInMs } from '@mockinho/core'
import { HttpContext } from '../HttpContext'
import { HttpRequest } from '../HttpRequest'

export function logReqAndResMiddleware(context: HttpContext) {
  return function (request: Request, response: Response, next: NextFunction): void {
    const req = request as HttpRequest

    response.on('close', () =>
      context.emit('onRequestEnd', {
        id: req.id,
        elapsed: nowInMs() - req.start,
        proxied: req.proxied,
        request: {
          method: req.method,
          href: req.href,
          path: req.path,
          query: req.query,
          params: req.params,
          headers: req.headers,
          isMultipart: req.isMultipart,
          files: req.files
        },
        response: { status: response.statusCode, headers: response.getHeaders() }
      })
    )

    next()
  }
}
