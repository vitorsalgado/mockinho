import { Response } from './Response'

export interface DuplexResponse extends Response {
  events: Array<{
    on: string
    data: unknown
  }>
}
