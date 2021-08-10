import { Request } from 'express'
import { Response } from 'express'
import { NextFunction } from 'express'
import { v4 as UUId } from 'uuid'
import { nowInMs } from './utils'

export function decorateRequestMiddleware(
  request: Request & { [key: string]: unknown },
  response: Response,
  next: NextFunction
): void {
  request.id = UUId()
  request.href = `${request.protocol}://${request.hostname}${request.url}`
  request.isMultiPart = request.headers['content-type']?.includes('multipart')
  request.start = nowInMs()

  next()
}
