import { JsonType } from '@mockdog/x'
import { SC } from '../../http.js'
import { StandardReply } from '../StandardReply.js'

export const ok = (): StandardReply => StandardReply.newBuilder().status(SC.OK)

export const okJSON = (body: JsonType): StandardReply => ok().bodyJSON(body)
