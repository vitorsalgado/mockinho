import { Request } from 'express'
import { Response } from 'express'
import { NextFunction } from 'express'

export function rawBodyMiddleware(
  request: Request & { [key: string]: unknown },
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
