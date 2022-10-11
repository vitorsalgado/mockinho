import { JsonType } from '@mockdog/x'
import { H, Methods, SC } from '../../http.js'
import { StandardReply } from './standard_reply.js'

export const response = (): StandardReply => StandardReply.newBuilder()

export const accepted = (): StandardReply => response().status(SC.Accepted)

export const badGateway = (): StandardReply => response().status(SC.BadGateway)

export const badRequest = (): StandardReply => response().status(SC.BadRequest)

export const created = (location?: string): StandardReply =>
  StandardReply.newBuilder().headerLocation(location).status(SC.Created)

export const createdJSON = (body: JsonType, location?: string): StandardReply =>
  created(location).bodyJSON(body)

export const forbidden = (): StandardReply => response().status(SC.Forbidden)

export const found = (location?: string): StandardReply =>
  response().headerLocation(location).status(SC.Found)

export const gatewayTimeout = (): StandardReply => response().status(SC.GatewayTimeout)

export const internalServerError = (): StandardReply => response().status(SC.InternalServerError)

export const methodNotAllowed = (allows?: Methods): StandardReply => {
  const builder = response().status(SC.MethodNotAllowed)

  if (allows) {
    return builder.header(H.Allow, allows)
  }

  return builder
}

export const movedPermanently = (location?: string): StandardReply =>
  response().status(SC.Moved_Permanently).headerLocation(location)

export const noContent = (): StandardReply => response().status(SC.NoContent)

export const notFound = (): StandardReply => response().status(SC.NotFound)

export const notFoundJSON = (body: JsonType): StandardReply => notFound().bodyJSON(body)

export const notModified = (): StandardReply => response().status(SC.NotModified)

export const ok = (): StandardReply => StandardReply.newBuilder().status(SC.OK)

export const okJSON = (body: JsonType): StandardReply => ok().bodyJSON(body)

export const seeOther = (location?: string): StandardReply =>
  response().status(SC.SeeOther).headerLocation(location)

export const serviceUnavailable = (): StandardReply => response().status(SC.ServiceUnavailable)

export const unauthorized = (wwwAuth?: string): StandardReply => {
  const builder = response().status(SC.Unauthorized)

  if (wwwAuth) {
    return builder.header(H.WwwAuthenticate, wwwAuth)
  }

  return builder
}

export const unprocessableEntity = (): StandardReply => response().status(SC.UnprocessableEntity)
