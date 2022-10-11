import { Request } from 'express'
import { Response } from 'express'
import { NextFunction } from 'express'
import { modeIsAtLeast } from '@mockdog/core'
import { Methods } from '../../http.js'
import { HttpContext } from '../../HttpContext.js'

export function logIncomingRequestMiddleware(context: HttpContext) {
  return function (req: Request, res: Response, next: NextFunction): void {
    context.emit('onRequestStart', {
      verbose: modeIsAtLeast(context.configuration, 'verbose'),
      method: req.method as Methods,
      url: req.url,
      path: req.path,
      body: req.body,
      headers: req.headers as Record<string, string>,
    })

    next()
  }
}
