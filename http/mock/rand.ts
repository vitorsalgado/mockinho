import { Response } from 'express'
import { notEmpty } from '@mockdog/x'
import { H, MediaTypes, SC } from '../http.js'
import { SrvRequest } from '../request.js'
import { Reply, ReplyCtx, ReplyFn, SrvResponse, wrapReply } from './reply.js'
import { StandardReply } from './StandardReply.js'

export const random = () => new RandomReply()

export class RandomReply implements Reply {
  private readonly _replies: Array<Reply> = []

  add(...replies: Array<Reply | ReplyFn>): this {
    notEmpty(replies)

    this._replies.push(...replies.map(x => wrapReply(x)))

    return this
  }

  build(req: SrvRequest, res: Response, ctx: ReplyCtx): Promise<SrvResponse | null> {
    const reply = this._replies[Math.floor(Math.random() * this._replies.length)]

    if (!reply) {
      const message =
        this._replies.length === 0
          ? 'No response has been configured for a random reply.'
          : 'Reply not found in the sequence.' + '\n' + `Replies: ${this._replies.length}`

      return Promise.resolve(
        StandardReply.newBuilder()
          .status(SC.TeaPot)
          .header(H.ContentType, MediaTypes.TEXT_PLAIN)
          .body(message)
          .build(req, res, ctx),
      )
    }

    return reply.build(req, res, ctx)
  }
}
