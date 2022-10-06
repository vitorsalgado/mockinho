import { JsonType } from '@mockdog/x'
import { SC } from '../../http.js'
import { StandardReply } from '../StandardReply.js'
import { response } from './response.js'

export const serviceUnavailable = (): StandardReply => response().status(SC.ServiceUnavailable)

export const serviceUnavailableJSON = (body: JsonType): StandardReply =>
  serviceUnavailable().bodyJSON(body)
