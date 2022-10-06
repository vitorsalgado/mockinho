import crypto from 'crypto'
import { Response } from 'express'
import { NextFunction } from 'express'
import { nowInMs } from '@mockdog/x'
import { decorate } from './_internal/decorate.js'
import { SrvRequest } from './request.js'

export function decorateRequest(request: SrvRequest, response: Response, next: NextFunction): void {
  decorate(request, 'id', crypto.randomUUID())
  decorate(request, 'href', `${request.protocol}://${request.hostname}${request.url}`)
  decorate(request, 'isMultipart', request.headers['content-type']?.includes('multipart'))
  decorate(request, 'start', nowInMs())

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
