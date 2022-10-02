import { Express } from 'express'
import { BodyType, Methods, Schemes } from '../../http.js'
import { HttpRequest } from '../../HttpRequest.js'

export const extractRequest = (request: HttpRequest): HttpRequest => request

export const extractScheme = (request: HttpRequest): Schemes => request.protocol as Schemes

export const extractMethod = (request: HttpRequest): Methods => request.method

export const extractUrl = (request: HttpRequest): string => request.href

export const extractBody = (request: HttpRequest): BodyType => request.body

export const extractHeader =
  (key: string) =>
  (request: HttpRequest): string =>
    request.headers[key]

export const extractHeaders = (request: HttpRequest): Record<string, string> => request.headers

export const extractQuery =
  (key: string) =>
  (request: HttpRequest): string | string[] =>
    request.query[key]

export const extractQueries = (
  request: HttpRequest,
): Record<string, string | string[] | undefined> => request.query

export const extractNothing = (): undefined => undefined

export const extractMultiPartFiles = (request: HttpRequest): Array<Express.Multer.File> =>
  request.files

export const extractFileByFieldName =
  (field: string) =>
  (request: HttpRequest): Express.Multer.File | undefined =>
    request.files.find(x => x.fieldname === field)

export const extractCookie =
  (key: string) =>
  (request: HttpRequest): string | undefined => {
    if (request.cookies && request.cookies[key]) {
      return request.cookies[key]
    } else if (request.signedCookies && request.signedCookies[key]) {
      return request.signedCookies[key]
    }

    return undefined
  }

export const extractCookieAsJson =
  (key: string) =>
  (request: HttpRequest): string | undefined => {
    if (request.cookies && request.cookies[key]) {
      return JSON.parse(request.cookies[key])
    } else if (request.signedCookies && request.signedCookies[key]) {
      return JSON.parse(request.signedCookies[key])
    }

    return undefined
  }
