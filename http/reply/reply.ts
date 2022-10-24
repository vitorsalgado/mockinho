import { CookieOptions, Response } from 'express'
import { Reply } from '@mockdog/core'
import { HttpConfiguration } from '../config/index.js'
import { HeaderList } from '../headers.js'
import { BodyType } from '../http.js'
import { SrvRequest } from '../request.js'

export interface Cookie {
  key: string
  value: string
  options?: CookieOptions
}

export interface CookieToClear {
  key: string
  options?: CookieOptions
}

export class SrvResponse {
  constructor(
    public readonly status: number,
    public readonly statusMessage?: string,
    public readonly headers = new HeaderList(),
    public readonly body: BodyType = null,
    public readonly trailers = new HeaderList(),
    public readonly cookies: Array<Cookie> = [],
    public readonly cookiesToClear: Array<CookieToClear> = [],
    public readonly delay: number = 0,
  ) {}

  hasDelay() {
    return this.delay > 0
  }
}

export interface ReplyCtx {
  config: HttpConfiguration
}

export type ReplyFn = (
  req: SrvRequest,
  res: Response,
  ctx: ReplyCtx,
) => Promise<SrvResponse | null | void>

export type HttpReply = Reply<SrvRequest, Response, HttpConfiguration, SrvResponse>

export class ReplyWrapper implements HttpReply {
  constructor(private readonly _replyFn: ReplyFn) {}

  build(req: SrvRequest, res: Response, ctx: ReplyCtx): Promise<SrvResponse | null | void> {
    return this._replyFn(req, res, ctx)
  }
}

export function wrapReply(reply: HttpReply | ReplyFn): HttpReply {
  if ('build' in reply) {
    return reply
  } else {
    return new ReplyWrapper(reply)
  }
}
