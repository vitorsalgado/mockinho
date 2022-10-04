import { Express } from 'express'
import { BodyType, Methods, Schemes } from '../../http.js'
import { SrvRequest } from '../../request.js'

export const extractRequest = (request: SrvRequest): SrvRequest => request

export const extractScheme = (request: SrvRequest): Schemes => request.protocol as Schemes

export const extractMethod = (request: SrvRequest): Methods => request.method

export const extractUrl = (request: SrvRequest): string => request.href

export const extractBody = (request: SrvRequest): BodyType => request.body

export const extractHeader =
  (key: string) =>
  (request: SrvRequest): string =>
    request.headers[key]

export const extractHeaders = (request: SrvRequest): Record<string, string> => request.headers

export const extractQuery =
  (key: string) =>
  (request: SrvRequest): string | null =>
    request.query.get(key)

export const extractQueries = (request: SrvRequest): URLSearchParams => request.query

export const extractNothing = (): undefined => undefined

export const extractMultiPartFiles = (request: SrvRequest): Array<Express.Multer.File> =>
  request.files

export const extractFileByFieldName =
  (field: string) =>
  (request: SrvRequest): Express.Multer.File | undefined =>
    request.files.find(x => x.fieldname === field)

export const extractCookie =
  (key: string) =>
  (request: SrvRequest): string | undefined => {
    if (request.cookies && request.cookies[key]) {
      return request.cookies[key]
    } else if (request.signedCookies && request.signedCookies[key]) {
      return request.signedCookies[key]
    }

    return undefined
  }

export const extractCookieAsJson =
  (key: string) =>
  (request: SrvRequest): string | undefined => {
    if (request.cookies && request.cookies[key]) {
      return JSON.parse(request.cookies[key])
    } else if (request.signedCookies && request.signedCookies[key]) {
      return JSON.parse(request.signedCookies[key])
    }

    return undefined
  }
