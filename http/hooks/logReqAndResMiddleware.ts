import { Response } from 'express'
import { NextFunction } from 'express'
import { Request } from 'express'
import { nowInMs } from '@mockdog/x'
import { HttpContext } from '../HttpContext.js'
import { SrvRequest } from '../request.js'

export function logReqAndResMiddleware(context: HttpContext) {
  return function (request: Request, response: Response, next: NextFunction): void {
    const req = request as unknown as SrvRequest

    response.on('close', () =>
      context.emit('onRequestEnd', {
        id: req.$internals.id,
        elapsed: nowInMs() - req.$internals.start,
        proxied: req.$internals.proxy,
        request: {
          method: req.method,
          href: req.$internals.href,
          path: req.path,
          query: req.query,
          params: req.params,
          headers: req.headers,
          isMultipart: req.$internals.isMultipart,
          files: req.files,
        },
        response: { status: response.statusCode, headers: response.getHeaders() },
      }),
    )

    next()
  }
}
