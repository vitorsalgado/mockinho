import { JsonType } from '@mockdog/x'
import { SC } from '../../http.js'
import { StandardReply } from '../StandardReply.js'
import { response } from './response.js'

export const unprocessableEntity = (): StandardReply => response().status(SC.UnprocessableEntity)

export const unprocessableEntityJSON = (body: JsonType): StandardReply =>
  unprocessableEntity().bodyJSON(body)
