import crypto from 'crypto'
import { Request } from 'express'
import { Response } from 'express'
import { NextFunction } from 'express'
import { nowInMs } from '@mockdog/x'

export function enhanceRequestMiddleware(
  request: Request & { [key: string]: unknown },
  response: Response,
  next: NextFunction,
): void {
  request.id = crypto.randomUUID()
  request.href = `${request.protocol}://${request.hostname}${request.url}`
  request.isMultiPart = request.headers['content-type']?.includes('multipart')
  request.start = nowInMs()

  request.toString = function (): string {
    return `Request{
      href: ${request.href},
      method: ${request.method}
      multipart: ${request.isMultiPart}
      headers: ${JSON.stringify(request.headers)}
     }`
  }

  next()
}
