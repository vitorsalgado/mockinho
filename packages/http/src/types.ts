import { Stream } from 'stream'
import { HttpResponseFixtureBuilder } from './mock'
import { HttpMockBuilder } from './mock'
import { HttpConfiguration } from './config'

export type Schemes = 'http' | 'https'
export type BodyType =
  | string
  | Buffer
  | Stream
  | undefined
  | Record<string, unknown>
  | unknown
  | null
export type HttpMethods = string | 'DELETE' | 'GET' | 'HEAD' | 'PATCH' | 'POST' | 'PUT' | 'OPTIONS'
export type DefaultConfiguration = HttpConfiguration
export type DecoratedResponseBuilder = HttpResponseFixtureBuilder & {
  [key: string]: (...args: Array<unknown>) => DecoratedResponseBuilder
}
export type DecoratedMockBuilder = HttpMockBuilder & {
  [key: string]: (...args: Array<unknown>) => DecoratedMockBuilder
}

export const MediaTypes = {
  APPLICATION_JSON: 'application/json;charset=utf-8',
  APPLICATION_FORM_URL_ENCODED: 'application/x-www-form-urlencoded;charset=utf-8',
  TEXT_PLAIN: 'text/plain;charset=utf-8'
}

export const Headers = {
  Accept: 'accept',
  ContentType: 'content-type',
  Location: 'location',
  WwwAuthenticate: 'www-authenticate',
  Authorization: 'authorization',
  Allow: 'allow'
}

export const StatusCodes = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,

  MOVED_PERMANENTLY: 301,
  FOUND: 302,
  SEE_OTHER: 303,
  NOT_MODIFIED: 404,

  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  UNPROCESSABLE_ENTITY: 422,

  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504
}

export const ErrorCodes = {
  ERR_DEF: 'ERR',
  ER_NO_MOCK_FOUND: 'ERR_NO_MOCK',
  ERR_PENDING_SCOPE: 'ERR_HTTP_PENDING_SCOPE',
  ERR_INVALID_MOCK_CONFIG: 'ERR_HTTP_INVALID_MOCK_CONFIG',
  ERR_INVALID_MOCK_FILE: 'ERR_HTTP_INVALID_MOCK_FILE',
  ERR_INVALID_RESPONSE_DEFINITION: 'ERR_HTTP_INVALID_RESPONSE_DEFINITION',
  ERR_CONFIG: 'ERR_CONFIG'
}
