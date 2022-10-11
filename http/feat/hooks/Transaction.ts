import http from 'node:http'
import { Express } from 'express'
import { Methods } from '../../http.js'

export interface Transaction {
  id: string
  elapsed: number
  proxied: boolean

  request: {
    method: Methods
    href: string
    path: string
    query: URLSearchParams
    params: Record<string, unknown>
    headers: http.IncomingHttpHeaders
    isMultipart: boolean
    files: Array<Express.Multer.File>
  }

  response: {
    status: number
    headers: Record<string, number | string | string[] | undefined>
  }
}
