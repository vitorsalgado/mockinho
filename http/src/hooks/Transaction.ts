import { Express } from 'express'
import { Methods } from '../Methods'

export interface Transaction {
  id: string
  elapsed: number
  proxied: boolean

  request: {
    method: Methods
    href: string
    path: string
    query: Record<string, string | Array<string>>
    params: Record<string, unknown>
    headers: Record<string, string>
    isMultipart: boolean
    files: Array<Express.Multer.File>
  }

  response: {
    status: number
    headers: Record<string, number | string | string[] | undefined>
  }
}
