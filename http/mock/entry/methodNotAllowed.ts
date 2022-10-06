import { H, Methods, SC } from '../../http.js'
import { StandardReply } from '../StandardReply.js'
import { response } from './response.js'

export const methodNotAllowed = (allows?: Methods): StandardReply => {
  const builder = response().status(SC.MethodNotAllowed)

  if (allows) {
    return builder.header(H.Allow, allows)
  }

  return builder
}
