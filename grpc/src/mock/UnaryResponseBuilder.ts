import { ServerErrorResponse } from '@grpc/grpc-js/build/src/server-call'
import { ServerStatusResponse } from '@grpc/grpc-js/build/src/server-call'
import { ResponseBuilder } from './ResponseBuilder'
import { ResponseBuilderDelegate } from './ResponseBuilderDelegate'
import { UnaryResponse } from './UnaryResponse'
import { UnaryExtendedCall } from './UnaryExtendedCall'

export class UnaryResponseBuilder extends ResponseBuilder<UnaryExtendedCall, UnaryResponse> {
  protected _data?: unknown = undefined
  protected _error: ServerErrorResponse | ServerStatusResponse | null = null

  data<T = unknown>(data: T): this {
    this._data = data
    return this
  }

  error(error: ServerErrorResponse | ServerStatusResponse | null): this {
    this._error = error
    return this
  }

  build(): ResponseBuilderDelegate<UnaryExtendedCall, UnaryResponse> {
    return async (_context, _request, _mock) => {
      return {
        data: this._data,
        metadata: this._metadata,
        flags: this._flags,
        error: this._error
      }
    }
  }
}
