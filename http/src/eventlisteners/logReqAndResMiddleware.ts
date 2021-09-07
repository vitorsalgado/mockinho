import { Response } from 'express'
import { NextFunction } from 'express'
import { nowInMs } from '@mockinho/core'
import { HttpContext } from '../HttpContext'
import { HttpRequest } from '../HttpRequest'

export function logReqAndResMiddleware(context: HttpContext) {
  return function (req: HttpRequest, res: Response, next: NextFunction): void {
    res.on('close', () =>
      context.emit('complete', {
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

        response: {
          status: res.statusCode,
          headers: res.getHeaders()
        }
      })
    )

    next()
  }
}
