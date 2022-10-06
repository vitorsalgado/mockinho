import { JsonType } from '@mockdog/x'
import { SC } from '../../http.js'
import { StandardReply } from '../StandardReply.js'

export const created = (location?: string): StandardReply =>
  StandardReply.newBuilder().headerLocation(location).status(SC.Created)

export const createdJSON = (body: JsonType, location?: string): StandardReply =>
  created(location).bodyJSON(body)
