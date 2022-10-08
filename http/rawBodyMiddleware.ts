import { Response } from 'express'
import { NextFunction } from 'express'
import { SrvRequest } from './request.js'

export function rawBodyMiddleware(
  request: SrvRequest,
  response: Response,
  next: NextFunction,
): void {
  const raw: Buffer[] = []

  request.on('data', chunk => raw.push(Buffer.from(chunk, 'binary')))
  request.on('end', () => {
    request.rawBody = Buffer.concat(raw)
  })

  next()
}
