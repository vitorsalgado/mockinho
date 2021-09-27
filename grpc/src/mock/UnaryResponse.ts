import { ServerErrorResponse } from '@grpc/grpc-js/build/src/server-call'
import { ServerStatusResponse } from '@grpc/grpc-js/build/src/server-call'
import { Response } from './Response'

export interface UnaryResponse extends Response {
  data?: unknown
  error: ServerErrorResponse | ServerStatusResponse | null
}
