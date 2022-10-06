import { JsonType } from '@mockdog/x'
import { SC } from '../../http.js'
import { StandardReply } from '../StandardReply.js'
import { response } from './response.js'

export const badRequest = (): StandardReply => response().status(SC.BadRequest)

export const badRequestJSON = (body: JsonType): StandardReply => badRequest().bodyJSON(body)
