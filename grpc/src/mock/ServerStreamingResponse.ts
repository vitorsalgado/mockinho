import Stream from 'stream'
import { Response } from './Response'

export interface ServerStreamingResponse extends Response {
  stream: Stream.Readable
}
