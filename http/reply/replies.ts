import { JsonType } from '@mockdog/x'
import { H, Methods, SC } from '../http.js'
import { StandardReply } from './standard.js'

export const newReply = (): StandardReply => StandardReply.newBuilder()

export const accepted = (): StandardReply => newReply().status(SC.Accepted)

export const badGateway = (): StandardReply => newReply().status(SC.BadGateway)

export const badRequest = (): StandardReply => newReply().status(SC.BadRequest)

export const created = (location?: string): StandardReply =>
  StandardReply.newBuilder().location(location).status(SC.Created)

export const createdJSON = (body: JsonType, location?: string): StandardReply =>
  created(location).json(body)

export const forbidden = (): StandardReply => newReply().status(SC.Forbidden)

export const found = (location?: string): StandardReply =>
  newReply().location(location).status(SC.Found)

export const gatewayTimeout = (): StandardReply => newReply().status(SC.GatewayTimeout)

export const internalServerError = (): StandardReply => newReply().status(SC.InternalServerError)

export const methodNotAllowed = (allows?: Methods): StandardReply => {
  const builder = newReply().status(SC.MethodNotAllowed)

  if (allows) {
    return builder.header(H.Allow, allows)
  }

  return builder
}

export const movedPermanently = (location?: string): StandardReply =>
  newReply().status(SC.Moved_Permanently).location(location)

export const noContent = (): StandardReply => newReply().status(SC.NoContent)

export const notFound = (): StandardReply => newReply().status(SC.NotFound)

export const notFoundJSON = (body: JsonType): StandardReply => notFound().json(body)

export const notModified = (): StandardReply => newReply().status(SC.NotModified)

export const ok = (): StandardReply => StandardReply.newBuilder().status(SC.OK)

export const okJSON = (body: JsonType): StandardReply => ok().json(body)

export const seeOther = (location?: string): StandardReply =>
  newReply().status(SC.SeeOther).location(location)

export const serviceUnavailable = (): StandardReply => newReply().status(SC.ServiceUnavailable)

export const unauthorized = (wwwAuth?: string): StandardReply => {
  const builder = newReply().status(SC.Unauthorized)

  if (wwwAuth) {
    return builder.header(H.WwwAuthenticate, wwwAuth)
  }

  return builder
}

export const unprocessableEntity = (): StandardReply => newReply().status(SC.UnprocessableEntity)
