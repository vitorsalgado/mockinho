import { MetadataValue } from '@grpc/grpc-js'
import { allOf } from 'matchers'
import { contains } from 'matchers'
import { MockBuilder } from '@mockdog/core'
import { Expectation } from '@mockdog/core'
import { MockSource } from '@mockdog/core'
import { Matcher } from '@mockdog/core'
import { notEmpty } from '@mockdog/core'
import { noNullElements } from '@mockdog/core'
import { notBlank } from '@mockdog/core'
import { notNull } from '@mockdog/core'
import { ExpectationWithContext } from '@mockdog/core'
import { UnaryExtendedCall } from './UnaryExtendedCall.js'
import { ResponseBuilderDelegate } from './ResponseBuilderDelegate.js'
import { Response } from './Response.js'
import { ResponseBuilder } from './ResponseBuilder.js'
import { RpcMock } from './RpcMock.js'

export class RpcMockBuilder<REQUEST, RESPONSE extends Response> extends MockBuilder<RpcMock> {
  protected readonly _expectations: Array<Expectation<unknown, unknown>> = []
  protected readonly _meta: Map<string, unknown> = new Map<string, unknown>()
  protected _responseBuilder!: ResponseBuilderDelegate<REQUEST, RESPONSE>

  constructor(
    private readonly _source: MockSource = 'code',
    private readonly _sourceDescription: string = '',
  ) {
    super()
  }

  static newBuilder<REQUEST, RESPONSE>(): RpcMockBuilder<REQUEST, RESPONSE> {
    return new RpcMockBuilder()
  }

  service(service: string): RpcMockBuilder<REQUEST, RESPONSE> {
    notBlank(service)

    this._expectations.push(
      this.spec((call: UnaryExtendedCall) => call.context.service, contains(service), 5),
    )

    return this
  }

  method(method: string): RpcMockBuilder<REQUEST, RESPONSE> {
    notBlank(method)

    this._expectations.push(
      this.spec((call: UnaryExtendedCall) => call.context.serviceMethod, contains(method), 5),
    )

    return this
  }

  meta(key: string, matcher: Matcher<MetadataValue[]>): this {
    notBlank(key)
    notNull(matcher)

    this._expectations.push(
      this.spec((call: UnaryExtendedCall) => call.metadata.get(key), matcher, 0.5),
    )

    return this
  }

  requestData(...matchers: Array<Matcher<unknown>>): this {
    notEmpty(matchers)
    noNullElements(matchers)

    if (matchers.length === 0) {
      this._expectations.push(this.spec((call: UnaryExtendedCall) => call.request, matchers[0], 5))
    }

    this._expectations.push(
      this.spec((call: UnaryExtendedCall) => call.request, allOf(...matchers), 5),
    )

    return this
  }

  reply(
    response: ResponseBuilder<REQUEST, RESPONSE> | ResponseBuilderDelegate<REQUEST, RESPONSE>,
  ): RpcMockBuilder<REQUEST, RESPONSE> {
    this._responseBuilder = response instanceof ResponseBuilder ? response.build() : response
    return this
  }

  build(): RpcMock {
    return new RpcMock(
      this._id,
      this._name,
      this._priority,
      this._source,
      this._sourceDescription,
      this._expectations,
      this._statefulExpectations as Array<ExpectationWithContext<unknown, unknown>>,
      this._responseBuilder as ResponseBuilderDelegate<unknown, RESPONSE>,
      this._meta,
      new Map<string, unknown>(),
    )
  }
}
