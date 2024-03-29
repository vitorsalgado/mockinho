import { Response } from 'express'
import { notEmpty } from '@mockdog/x'
import { H, Media, SC } from '../http.js'
import { SrvRequest } from '../request.js'
import { HttpReply, ReplyCtx, ReplyFn, SrvResponse, wrapReply } from './reply.js'
import { StandardReply } from './standard.js'

export const sequence = () => new SequenceReply()

export class SequenceReply implements HttpReply {
  private readonly _replies: Array<HttpReply> = []
  private _afterEndedReply?: HttpReply
  private _restartSequenceAfterEnded = false
  private _hits = 0

  add(...replies: Array<HttpReply | ReplyFn>): this {
    notEmpty(replies)

    this._replies.push(...replies.map(x => wrapReply(x)))

    return this
  }

  replyAfterEnded(reply: HttpReply | ReplyFn): this {
    this._afterEndedReply = wrapReply(reply)
    return this
  }

  restartAfterEnded(): this {
    this._restartSequenceAfterEnded = true
    return this
  }

  build(req: SrvRequest, res: Response, ctx: ReplyCtx): Promise<SrvResponse | null | void> {
    if (this._restartSequenceAfterEnded && this._afterEndedReply) {
      throw new Error(
        '"Sequence Reply" cannot use both "reply after ended" and "restart after ended" strategies for when the sequence is over.',
      )
    }

    const reply = this._replies[this._hits]

    if (!reply) {
      if (this._afterEndedReply) {
        return this._afterEndedReply.build(req, res, ctx)
      }

      return Promise.resolve(
        StandardReply.newBuilder()
          .status(SC.TeaPot)
          .header(H.ContentType, Media.PlainText)
          .body(
            'Reply not found in the sequence.' +
              '\n' +
              `Current Hit: ${this._hits}` +
              '\n' +
              `Replies: ${this._replies.length}`,
          )
          .build(req, res, ctx),
      )
    }

    this._hits++

    return reply.build(req, res, ctx)
  }
}
