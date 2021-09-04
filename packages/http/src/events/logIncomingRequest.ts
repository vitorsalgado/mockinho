import { Request } from 'express'
import { Response } from 'express'
import { NextFunction } from 'express'
import { HttpContext } from '../HttpContext'

export function logIncomingRequest(context: HttpContext) {
  return function (req: Request, res: Response, next: NextFunction): void {
    context.emit('request', {
      verbose: context.configuration.modeIsAtLeast('verbose'),
      method: req.method,
      url: req.url,
      body: req.body,
      headers: req.headers as Record<string, string>
    })

    next()
  }
}
