import { HttpRequest } from '../HttpRequest.js'
import { HttpContext } from '../HttpContext.js'
import { MediaTypes } from '../MediaTypes.js'
import { Headers } from '../Headers.js'
import { ResponseBuilder } from './ResponseBuilder.js'
import { ResponseFixture } from './ResponseFixture.js'
import { HttpMock } from './HttpMock.js'
import { ResponseDelegate } from './ResponseDelegate.js'

export type MultiResponseStrategy = 'sequential' | 'random'

export class MultipleResponseBuilder extends ResponseBuilder {
  private readonly _responses: Array<ResponseBuilder> = []
  private _strategy: MultiResponseStrategy = 'sequential'
  private _errorOnNotFound: boolean = true

  type(strategy: MultiResponseStrategy): this {
    this._strategy = strategy
    return this
  }

  add(...builder: Array<ResponseBuilder>): this {
    this._responses.push(...builder)
    return this
  }

  errorOnNotFound(value: boolean): this {
    this._errorOnNotFound = value
    return this
  }

  build(): ResponseDelegate {
    return async (
      context: HttpContext,
      request: HttpRequest,
      mock: HttpMock
    ): Promise<ResponseFixture> => {
      if (this._responses.length === 0) {
        throw new Error(
          'You need to set at least one response when using multiple response builder'
        )
      }

      let builder

      switch (this._strategy) {
        case 'sequential':
          builder = this._responses[mock.hits - 1]
          break

        case 'random':
          builder = this._responses[Math.floor(Math.random() * this._responses.length)]
          break

        default:
          builder = this._responses[0]
      }

      if (!builder) {
        if (this._errorOnNotFound) {
          return ResponseBuilder.newBuilder()
            .status(500)
            .header(Headers.ContentType, MediaTypes.TEXT_PLAIN)
            .body(
              `Unable to obtain a response. Request Number: ${mock.hits} - Responses: ${this._responses.length}`
            )
            .build()(context, request, mock)
        } else {
          builder = this._responses[0]
        }
      }

      return builder.build()(context, request, mock)
    }
  }
}
