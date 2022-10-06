import { JsonType } from '@mockdog/x'
import { SC } from '../../http.js'
import { StandardReply } from '../StandardReply.js'
import { response } from './response.js'

export const gatewayTimeout = (): StandardReply => response().status(SC.GatewayTimeout)

export const gatewayTimeoutJSON = (body: JsonType): StandardReply => gatewayTimeout().bodyJSON(body)
