import { Response } from './Response.js'

export interface DuplexResponse extends Response {
  events: Array<{
    on: string
    data: unknown
  }>
}
