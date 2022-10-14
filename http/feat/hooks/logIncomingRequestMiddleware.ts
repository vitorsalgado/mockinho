import { Response } from 'express'
import { NextFunction } from 'express'
import { modeIsAtLeast } from '@mockdog/core'
import { Methods } from '../../http.js'
import { SrvRequest } from '../../request.js'

export function logIncomingRequestMiddleware(
  req: SrvRequest,
  res: Response,
  next: NextFunction,
): void {
  req.$ctx.hooks.emit('onRequestStart', {
    verbose: modeIsAtLeast(req.$ctx.config, 'verbose'),
    method: req.method as Methods,
    url: req.url,
    path: req.path,
    body: req.body,
    headers: req.headers as Record<string, string>,
  })

  next()
}
