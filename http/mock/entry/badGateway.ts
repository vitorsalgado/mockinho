import { JsonType } from '@mockdog/x'
import { SC } from '../../http.js'
import { StandardReply } from '../StandardReply.js'
import { response } from './response.js'

export const badGateway = (): StandardReply => response().status(SC.BadGateway)

export const badGatewayJSON = (body: JsonType): StandardReply => badGateway().bodyJSON(body)
