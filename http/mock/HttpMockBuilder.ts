import { Express } from 'express'
import { allOf, equalsTo, repeatTimes } from '@mockdog/core-matchers'
import { anyItem } from '@mockdog/core-matchers'
import { anything } from '@mockdog/core-matchers'
import { encodeBase64 } from '@mockdog/core'
import { Matcher } from '@mockdog/core'
import { notNull } from '@mockdog/core'
import { noNullElements } from '@mockdog/core'
import { notBlank } from '@mockdog/core'
import { notEmpty } from '@mockdog/core'
import { MockSource } from '@mockdog/core'
import { MockBuilder } from '@mockdog/core'
import { Expectation } from '@mockdog/core'
import { MatcherContextHolder } from '@mockdog/core'
import { ExpectationWithContext } from '@mockdog/core'
import { Configuration } from '@mockdog/core'
import { HttpRequest } from '../HttpRequest.js'
import { bearerToken, urlPath } from '../matchers/index.js'
import { Headers } from '../Headers.js'
import { BodyType } from '../BodyType.js'
import { Methods } from '../Methods.js'
import { Schemes } from '../Schemes.js'
import { HttpConfiguration } from '../config/index.js'
import { HttpMock } from './HttpMock.js'
import { ResponseBuilder } from './ResponseBuilder.js'
import { extractCookieAsJson } from './util/extractors.js'
import { extractCookie } from './util/extractors.js'
import { extractFileByFieldName } from './util/extractors.js'
import { extractMultiPartFiles } from './util/extractors.js'
import { extractNothing } from './util/extractors.js'
import { extractQueries } from './util/extractors.js'
import { extractQuery } from './util/extractors.js'
import { extractHeaders } from './util/extractors.js'
import { extractHeader } from './util/extractors.js'
import { extractBody } from './util/extractors.js'
import { extractUrl } from './util/extractors.js'
import { extractMethod } from './util/extractors.js'
import { extractScheme } from './util/extractors.js'
import { extractRequest } from './util/extractors.js'
import { ResponseDelegate } from './ResponseDelegate.js'

export class HttpMockBuilder extends MockBuilder<HttpMock> {
  private readonly _expectations: Array<Expectation<unknown, unknown>> = []
  private readonly _meta: Map<string, unknown> = new Map<string, unknown>()
  private _responseBuilder!: ResponseDelegate

  constructor(
    private readonly _source: MockSource = 'code',
    private readonly _sourceDescription: string = ''
  ) {
    super()
  }

  static newBuilder = (): HttpMockBuilder => new HttpMockBuilder()

  url(matcher: Matcher<string> | string): this {
    notNull(matcher)

    const meta = 'URL'

    if (typeof matcher === 'string') {
      notBlank(matcher)

      this._meta.set(meta, matcher)
      this._expectations.push(this.spec(extractUrl, urlPath(matcher), 10))
    } else {
      this._expectations.push(this.spec(extractUrl, matcher, 10))
    }

    return this
  }

  method(matcher: Matcher<Methods> | Methods | Array<Methods>): this {
    notNull(matcher)

    const meta = 'Method'

    if (typeof matcher === 'string') {
      notBlank(matcher)

      this._meta.set(meta, matcher)

      if (matcher.trim() === '*') {
        this._expectations.push(this.spec(extractMethod, anything(), 0))
      } else {
        this._expectations.push(this.spec(extractMethod, equalsTo(matcher), 3))
      }
    } else if (Array.isArray(matcher)) {
      notEmpty(matcher)
      noNullElements(matcher)

      this._meta.set(meta, matcher.join(','))
      this._expectations.push(this.spec(extractMethod, anyItem(matcher), 3))
    } else {
      this._expectations.push(this.spec(extractMethod, matcher, 3))
    }

    return this
  }

  scheme(scheme: Schemes): this {
    this._expectations.push(this.spec(extractScheme, equalsTo(scheme), 1))

    return this
  }

  header(key: string, matcher: Matcher<string> | string): this {
    notBlank(key)
    notNull(matcher)

    if (typeof matcher === 'string') {
      this._expectations.push(this.spec(extractHeader(key.toLowerCase()), equalsTo(matcher), 0.5))
    } else {
      this._expectations.push(this.spec(extractHeader(key.toLowerCase()), matcher, 0.5))
    }

    return this
  }

  headers(matcher: Matcher<Record<string, string>>): this {
    notNull(matcher)

    this._expectations.push(this.spec(extractHeaders, matcher, 3))

    return this
  }

  contentType(matcher: Matcher<string> | string): this {
    notNull(matcher)

    if (typeof matcher === 'string') {
      this._expectations.push(this.spec(extractHeader(Headers.ContentType), equalsTo(matcher), 0.5))
    } else {
      this._expectations.push(this.spec(extractHeader(Headers.ContentType), matcher, 0.5))
    }

    return this
  }

  basicAuthorization(username: string, password: string): this {
    notNull(username)
    notNull(password)

    this._expectations.push(
      this.spec(
        extractHeader(Headers.Authorization),
        equalsTo(encodeBase64(`Basic ${username}:${password}`)),
        0.5
      )
    )

    return this
  }

  bearerAuthorization(token: string): this {
    notNull(token)

    this._expectations.push(this.spec(extractRequest, bearerToken(token), 0.5))

    return this
  }

  query(key: string, matcher: Matcher<string | string[] | undefined> | string): this {
    notBlank(key)
    notNull(matcher)

    if (typeof matcher === 'string') {
      this._expectations.push(
        this.spec(extractQuery(key), equalsTo<string | string[] | undefined>(matcher), 0.5)
      )
    } else {
      this._expectations.push(this.spec(extractQuery(key), matcher, 0.5))
    }

    return this
  }

  querystring(matcher: Matcher<Record<string, string | string[] | undefined>>): this {
    notNull(matcher)

    this._expectations.push(this.spec(extractQueries, matcher, 3))

    return this
  }

  requestBody(...matchers: Array<Matcher<BodyType>>): this {
    notEmpty(matchers)
    noNullElements(matchers)

    if (matchers.length === 0) {
      this._expectations.push(this.spec(extractBody, matchers[0], 5))
    }

    this._expectations.push(this.spec(extractBody, allOf(...matchers), 5))

    return this
  }

  requestFields(...matchers: Array<Matcher<BodyType>>): this {
    return this.requestBody(...matchers)
  }

  files(...matchers: Array<Matcher<Array<Express.Multer.File>>>): this {
    notEmpty(matchers)
    noNullElements(matchers)

    if (matchers.length === 0) {
      this._expectations.push(this.spec(extractMultiPartFiles, matchers[0], 3))
    }

    this._expectations.push(this.spec(extractMultiPartFiles, allOf(...matchers), 5))

    return this
  }

  file(fieldName: string, ...matchers: Array<Matcher<Express.Multer.File | undefined>>): this {
    notBlank(fieldName)
    notEmpty(matchers)
    noNullElements(matchers)

    if (matchers.length === 0) {
      this._expectations.push(this.spec(extractFileByFieldName(fieldName), matchers[0], 3))
    }

    this._expectations.push(this.spec(extractFileByFieldName(fieldName), allOf(...matchers), 5))

    return this
  }

  cookie(key: string, matcher: Matcher<string> | string): this {
    if (typeof matcher === 'string') {
      this._expectations.push(
        this.spec(extractCookie(key), equalsTo<string | undefined>(matcher), 0.5)
      )
    } else {
      this._expectations.push(this.spec(extractCookie(key) as any, matcher, 0.5))
    }

    return this
  }

  cookieJson(key: string, matcher: Matcher<Record<string, unknown>> | string): this {
    if (typeof matcher === 'string') {
      this._expectations.push(
        this.spec(extractCookieAsJson(key), equalsTo<string | undefined>(matcher), 0.5)
      )
    } else {
      this._expectations.push(this.spec(extractCookieAsJson(key) as any, matcher, 0.5))
    }

    return this
  }

  repeatTimes(times: number): this {
    notNull(times)

    this._expectations.push(this.spec(extractNothing, repeatTimes(times), 0))

    return this
  }

  expect(...matchers: Array<Matcher<HttpRequest> | Matcher<unknown> | Matcher>): this {
    notEmpty(matchers)
    noNullElements(matchers)

    if (matchers.length === 1) {
      this._expectations.push(this.spec(extractRequest, matchers[0] as Matcher<unknown>, 1))
    } else {
      this._expectations.push(
        this.spec(extractRequest, allOf(...(matchers as Array<Matcher<unknown>>)), 1)
      )
    }

    return this
  }

  expectWithContext(
    ...matchers: Array<MatcherContextHolder<HttpMock, HttpConfiguration, HttpRequest>>
  ): this {
    notEmpty(matchers)
    noNullElements(matchers)

    this._statefulExpectations.push(
      ...matchers.map(
        matcher =>
          ({
            valueGetter: (request: HttpRequest) => request,
            matcherContext: matcher
          } as unknown as ExpectationWithContext<unknown, unknown, HttpMock, Configuration>)
      )
    )

    return this
  }

  proxyTo(target: string, response: ResponseBuilder): this {
    response.proxyFrom(target)

    this._responseBuilder = response.build()

    return this
  }

  reply(response: ResponseBuilder | ResponseDelegate): this {
    this._responseBuilder = response instanceof ResponseBuilder ? response.build() : response
    return this
  }

  build(): HttpMock {
    this.validate()

    return new HttpMock(
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

  validate(): void {
    notEmpty(this._expectations, 'Mocks needs to have at least one Matcher.')
    noNullElements(this._expectations, 'Matchers list must not contain null or undefined elements.')
    notNull(this._responseBuilder, 'Response definition is required. Call .reply() to create one.')
  }
}
