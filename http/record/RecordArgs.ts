import { BodyType, Methods } from '../http.js'

export interface RecordArgs {
  request: {
    id: string
    url: string
    path: string
    method: Methods
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
