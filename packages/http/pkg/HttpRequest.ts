import { FastifyRequest } from 'fastify'
import { BodyType, HttpMethods } from './types'

export interface HttpRequest extends FastifyRequest {
  id: string
  href: string
  url: string
  method: HttpMethods
  headers: Record<string, string>
  query: Record<string, string | Array<string>>
  body: BodyType
}
