import { Request } from 'express'
import { Response } from 'express'
import { NextFunction } from 'express'
import { HttpContext } from '../HttpContext'
import { HttpMethods } from '../types'

export function logIncomingRequestMiddleware(context: HttpContext) {
  return function (req: Request, res: Response, next: NextFunction): void {
    context.emit('request', {
      verbose: context.configuration.modeIsAtLeast('verbose'),
      method: req.method as HttpMethods,
      url: req.url,
      path: req.path,
      body: req.body,
      headers: req.headers as Record<string, string>
    })

    next()
  }
}
