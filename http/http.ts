import { Stream } from 'stream'
import { JsonType } from '@mockdog/x'

export const Headers = {
  Accept: 'accept',
  ContentType: 'content-type',
  ContentLength: 'content-length',
  Location: 'location',
  WwwAuthenticate: 'www-authenticate',
  Authorization: 'authorization',
  Allow: 'allow',
}

export const MediaTypes = {
  APPLICATION_JSON: 'application/json;charset=utf-8',
  APPLICATION_FORM_URL_ENCODED: 'application/x-www-form-urlencoded;charset=utf-8',
  TEXT_PLAIN: 'text/plain;charset=utf-8',
}

export type Methods =
  | 'GET'
  | 'HEAD'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  | 'PATCH'
  | 'OPTIONS'
  | 'TRACE'
  | 'CONNECT'

export type Schemes = 'http' | 'https'

export type BodyType = string | Buffer | Stream | undefined | JsonType | unknown | null

export const StatusCodes = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,

  MOVED_PERMANENTLY: 301,
  FOUND: 302,
  SEE_OTHER: 303,
  NOT_MODIFIED: 304,

  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  GONE: 410,
  TEAPOT: 418,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,

  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
}
