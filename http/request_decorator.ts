import crypto from 'crypto'
import { Response } from 'express'
import { NextFunction } from 'express'
import { nowInMs } from '@mockdog/x'
import { decorate } from './_internal/decorate.js'
import { SrvRequestInternals, SrvRequest } from './request.js'

export function decorateRequest(request: SrvRequest, response: Response, next: NextFunction): void {
  const contentType = request.header('content-type') || ''

  decorate<SrvRequest, SrvRequestInternals>(request, '$internals', {
    id: crypto.randomUUID(),
    href: `${request.protocol}://${request.hostname}${request.url}`,
    isMultipart: contentType.includes('multipart'),
    start: nowInMs(),
    rawBody: null,
    proxy: false,
    proxyTarget: '',
  })
  decorate(request, 'locals', {})

  const raw: Buffer[] = []

  request.on('data', chunk => raw.push(Buffer.from(chunk, 'binary')))
  request.on('end', () => {
    request.$internals.rawBody = Buffer.concat(raw)
  })

  next()
}
