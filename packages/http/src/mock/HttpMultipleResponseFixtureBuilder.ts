import { HttpRequest } from '../HttpRequest'
import { HttpContext } from '../HttpContext'
import { Headers } from '../types'
import { MediaTypes } from '../types'
import { HttpResponseFixtureBuilder } from './HttpResponseFixtureBuilder'
import { HttpResponseFixtureBuilderFunction } from './HttpResponseFixtureBuilder'
import { HttpResponseFixture } from './HttpResponseFixture'
import { HttpMock } from './HttpMock'
import { InvalidResponseFixtureError } from './errors/InvalidResponseFixtureError'

export type MultiResponseStrategy = 'sequential' | 'random'

export class HttpMultipleResponseFixtureBuilder extends HttpResponseFixtureBuilder {
  private readonly _responses: Array<HttpResponseFixtureBuilder> = []
  private _strategy: MultiResponseStrategy = 'sequential'
  private _errorOnNotFound: boolean = true

  type(strategy: MultiResponseStrategy): this {
    this._strategy = strategy
    return this
  }

  add(...builder: Array<HttpResponseFixtureBuilder>): this {
    this._responses.push(...builder)
    return this
  }

  errorOnNotFound(value: boolean): this {
    this._errorOnNotFound = value
    return this
  }

  build(): HttpResponseFixtureBuilderFunction {
    return async (
      context: HttpContext,
      request: HttpRequest,
      mock: HttpMock
    ): Promise<HttpResponseFixture> => {
      if (this._responses.length === 0) {
        throw new InvalidResponseFixtureError(
          'You need to set at least one response when using multiple response builder'
        )
      }

      let builder

      switch (this._strategy) {
        case 'sequential':
          builder = this._responses[mock.totalHits() - 1]
          break

        case 'random':
          builder = this._responses[Math.floor(Math.random() * this._responses.length)]
          break

        default:
          builder = this._responses[0]
      }

      if (!builder) {
        if (this._errorOnNotFound) {
          return HttpResponseFixtureBuilder.newBuilder()
            .status(500)
            .header(Headers.ContentType, MediaTypes.TEXT_PLAIN)
            .body(
              `Unable to obtain a response. Request Number: ${mock.totalHits()} - Responses: ${
                this._responses.length
              }`
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
