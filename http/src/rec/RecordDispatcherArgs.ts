import { HttpMethods } from '../types'
import { BodyType } from '../types'

export interface RecordDispatcherArgs {
  request: {
    id: string
    url: string
    path: string
    method: HttpMethods
    headers: Record<string, string>
    query: Record<string, string | Array<string>>
    body: BodyType
  }
  response: {
    status: number
    headers: Record<string, string>
    body: Buffer
  }
}
