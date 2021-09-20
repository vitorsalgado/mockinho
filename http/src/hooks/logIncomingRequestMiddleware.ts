import { Request } from 'express'
import { Response } from 'express'
import { NextFunction } from 'express'
import { HttpContext } from '../HttpContext'
import { Methods } from '../Methods'

export function logIncomingRequestMiddleware(context: HttpContext) {
  return function (req: Request, res: Response, next: NextFunction): void {
    context.emit('onRequestStart', {
      verbose: context.configuration.modeIsAtLeast('verbose'),
      method: req.method as Methods,
      url: req.url,
      path: req.path,
      body: req.body,
      headers: req.headers as Record<string, string>
    })

    next()
  }
}