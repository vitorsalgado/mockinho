import Stream from 'stream'
import { Readable } from 'stream'
import { ReadableOptions } from 'stream'
import { ServerErrorResponse } from '@grpc/grpc-js/build/src/server-call'
import { ServerStatusResponse } from '@grpc/grpc-js/build/src/server-call'
import { ResponseBuilder } from './ResponseBuilder'
import { ResponseBuilderDelegate } from './ResponseBuilderDelegate'
import { ServerStreamingResponse } from './ServerStreamingResponse'
import { ServerStreamingExtendedCall } from './ServerStreamingExtendedCall'

export class ServerStreamingResponseBuilder extends ResponseBuilder<
  ServerStreamingExtendedCall,
  ServerStreamingResponse
> {
  protected _data!: Stream.Readable
  protected _error: ServerErrorResponse | ServerStatusResponse | null = null

  stream(data: Stream.Readable): this {
    this._data = data
    return this
  }

  generator<T = unknown>(fn: Generator<T, void, unknown>, options?: ReadableOptions): this {
    this._data = Readable.from(fn, options)
    return this
  }

  error(error: ServerErrorResponse | ServerStatusResponse | null): this {
    this._error = error
    return this
  }

  build(): ResponseBuilderDelegate<ServerStreamingExtendedCall, ServerStreamingResponse> {
    return async (_context, _request, _mock) => {
      return {
        stream: this._data
      }
    }
  }
}
