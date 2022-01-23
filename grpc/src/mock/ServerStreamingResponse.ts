import Stream from 'stream'
import { Response } from './Response.js'

export interface ServerStreamingResponse extends Response {
  stream: Stream.Readable
}
