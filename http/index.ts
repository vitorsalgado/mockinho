import { request, anyMethod, get, post, put, del, patch, head } from './builder.js'
import {
  newReply,
  ok,
  okJSON,
  accepted,
  created,
  createdJSON,
  noContent,
  badGateway,
  badRequest,
  found,
  gatewayTimeout,
  forbidden,
  internalServerError,
  notFound,
  notFoundJSON,
  notModified,
  methodNotAllowed,
  seeOther,
  movedPermanently,
  serviceUnavailable,
  unauthorized,
  unprocessableEntity,
} from './reply/replies.js'
import { HttpConfiguration, HttpConfigurationBuilder } from './config/index.js'
import { MockDogHttp } from './MockDogHttp.js'

export * from './config/index.js'
export * from './feat/hooks/index.js'
export * from './srv.js'
export * from './request.js'
export * from './builder.js'
export * from './MockDogHttp.js'
export * from './feat/matchers/index.js'
export * from './_internal/errors.js'
export * from './srv.js'
export * from './http.js'

export const req = { request, anyMethod, get, post, put, del, patch, head }
export const reply = {
  newReply,
  ok,
  okJSON,
  accepted,
  created,
  createdJSON,
  noContent,
  badGateway,
  badRequest,
  found,
  gatewayTimeout,
  forbidden,
  internalServerError,
  notFound,
  notFoundJSON,
  notModified,
  methodNotAllowed,
  seeOther,
  movedPermanently,
  serviceUnavailable,
  unauthorized,
  unprocessableEntity,
}
export const httpMock = (
  configurations: HttpConfigurationBuilder | HttpConfiguration,
): MockDogHttp => new MockDogHttp(configurations)
