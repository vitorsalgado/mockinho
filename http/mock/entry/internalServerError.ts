import { JsonType } from '@mockdog/x'
import { SC } from '../../http.js'
import { StandardReply } from '../StandardReply.js'
import { response } from './response.js'

export const internalServerError = (): StandardReply => response().status(SC.InternalServerError)

export const internalServerErrorJSON = (body: JsonType): StandardReply =>
  internalServerError().bodyJSON(body)
