import { Response } from 'express'
import { NextFunction } from 'express'
import { nowInMs } from '@mockdog/x'
import { SrvRequest } from '../../request.js'

export function logReqAndResMiddleware(
  request: SrvRequest,
  response: Response,
  next: NextFunction,
): void {
  const req = request as unknown as SrvRequest

  response.on('close', () =>
    request.$ctx.hooks.emit('onRequestEnd', {
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
