import { JsonType } from '@mockdog/x'
import { H, SC } from '../../http.js'
import { StandardReply } from '../StandardReply.js'
import { response } from './response.js'

export const unauthorized = (wwwAuth?: string): StandardReply => {
  const builder = response().status(SC.Unauthorized)

  if (wwwAuth) {
    return builder.header(H.WwwAuthenticate, wwwAuth)
  }

  return builder
}

export const unauthorizedJSON = (body: JsonType, wwwAuth?: string): StandardReply =>
  unauthorized(wwwAuth).bodyJSON(body)
