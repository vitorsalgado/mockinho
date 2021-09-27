import { MockBuilder } from '@mockdog/core'
import { Expectation } from '@mockdog/core'
import { MockSource } from '@mockdog/core'
import { RpcContext } from '../RpcContext'
import { ResponseBuilderDelegate } from './ResponseBuilderDelegate'
import { Response } from './Response'
import { ResponseBuilder } from './ResponseBuilder'
import { RpcMock } from './RpcMock'

export class RpcMockBuilder extends MockBuilder {
  protected readonly _expectations: Array<Expectation<unknown, unknown>> = []
  protected readonly _meta: Map<string, unknown> = new Map<string, unknown>()
  protected _responseBuilder!: ResponseBuilderDelegate<Response>

  constructor(
    private readonly _source: MockSource = 'code',
    private readonly _sourceDescription: string = ''
  ) {
    super()
  }

  static newBuilder(): RpcMockBuilder {
    return new RpcMockBuilder()
  }

  reply(response: ResponseBuilder<Response> | ResponseBuilderDelegate<Response>): RpcMockBuilder {
    this._responseBuilder = response instanceof ResponseBuilder ? response.build() : response
    return this
  }

  build(_context: RpcContext): RpcMock {
    return new RpcMock(
      this._id,
      this._name,
      this._priority,
      this._source,
      this._sourceDescription,
      this._expectations,
      this._statefulExpectations,
      this._responseBuilder,
      this._meta,
      new Map<string, unknown>()
    )
  }
}
