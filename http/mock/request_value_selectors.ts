import { Express } from 'express'
import { BodyType, Methods, Schemes } from '../http.js'
import { SrvRequest } from '../request.js'

export const selector = {
  request: (request: SrvRequest): SrvRequest => request,

  scheme: (request: SrvRequest): Schemes => request.protocol as Schemes,

  method: (request: SrvRequest): Methods => request.method,

  url: (request: SrvRequest): string => request.$internals.href,

  body: (request: SrvRequest): BodyType => request.body,

  header:
    (key: string) =>
    (request: SrvRequest): string =>
      // FIXME: use request.header()
      request.headers[key],

  headers: (request: SrvRequest): Record<string, string> => request.headers,

  query:
    (key: string) =>
    (request: SrvRequest): string | null =>
      request.query.get(key),

  queries: (key: string) => (request: SrvRequest) => request.query.getAll(key),

  fullQuerystring: (request: SrvRequest): URLSearchParams => request.query,

  nothing: (): undefined => undefined,

  files: (request: SrvRequest): Array<Express.Multer.File> => request.files,

  fileByFieldName:
    (field: string) =>
    (request: SrvRequest): Express.Multer.File | undefined =>
      request.files.find(x => x.fieldname === field),

  cookie:
    (key: string) =>
    (request: SrvRequest): string | undefined => {
      if (request.cookies && request.cookies[key]) {
        return request.cookies[key]
      } else if (request.signedCookies && request.signedCookies[key]) {
        return request.signedCookies[key]
      }

      return undefined
    },

  jsonCookie:
    (key: string) =>
    (request: SrvRequest): string | undefined => {
      if (request.cookies && request.cookies[key]) {
        return JSON.parse(request.cookies[key])
      } else if (request.signedCookies && request.signedCookies[key]) {
        return JSON.parse(request.signedCookies[key])
      }

      return undefined
    },
}
