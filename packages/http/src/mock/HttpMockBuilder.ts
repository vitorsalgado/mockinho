import { Express } from 'express'
import { allOf, equalsTo, repeatTimes } from '@mockinho/core-matchers'
import { anyItem } from '@mockinho/core-matchers'
import { encodeBase64 } from '@mockinho/core'
import { Matcher } from '@mockinho/core'
import { notNull } from '@mockinho/core'
import { noNullElements } from '@mockinho/core'
import { notBlank } from '@mockinho/core'
import { notEmpty } from '@mockinho/core'
import { MockSource } from '@mockinho/core'
import { MockBuilder } from '@mockinho/core'
import { DecoratedMockBuilder } from '../types'
import { BodyType, Headers } from '../types'
import { Schemes } from '../types'
import { HttpRequest } from '../HttpRequest'
import { HttpContext } from '../HttpContext'
import { bearerToken, urlPath } from '../matchers'
import { HttpMock } from './HttpMock'
import { HttpResponseFixtureBuilder } from './HttpResponseFixtureBuilder'
import { HttpResponseFixtureBuilderFunction } from './HttpResponseFixtureBuilder'
import { extractCookieAsJson } from './util/extractors'
import { extractCookie } from './util/extractors'
import { extractFileByFieldName } from './util/extractors'
import { extractMultiPartFiles } from './util/extractors'
import { extractNothing } from './util/extractors'
import { extractQueries } from './util/extractors'
import { extractQuery } from './util/extractors'
import { extractHeaders } from './util/extractors'
import { extractHeader } from './util/extractors'
import { extractBody } from './util/extractors'
import { extractUrl } from './util/extractors'
import { extractMethod } from './util/extractors'
import { extractScheme } from './util/extractors'
import { extractRequest } from './util/extractors'

export class HttpMockBuilder extends MockBuilder {
  private readonly _meta: Map<string, unknown> = new Map<string, unknown>()
  private _responseBuilder!: HttpResponseFixtureBuilderFunction

  constructor(
    private readonly _source: MockSource = 'code',
    private readonly _sourceDescription: string = ''
  ) {
    super()
  }

  static newBuilder = (): DecoratedMockBuilder => new HttpMockBuilder() as DecoratedMockBuilder

  url(matcher: Matcher<string> | string): this {
    notNull(matcher)

    if (typeof matcher === 'string') {
      notBlank(matcher)

      this._meta.set('url', matcher)
      this._matchers.push(this.spec(extractUrl, urlPath(matcher), 10, 'Url'))
    } else {
      this._matchers.push(this.spec(extractUrl, matcher, 10, 'Url'))
    }

    return this
  }

  method(matcher: Matcher<string> | string | Array<string>): this {
    notNull(matcher)

    if (typeof matcher === 'string') {
      notBlank(matcher)

      this._meta.set('method', matcher)
      this._matchers.push(this.spec(extractMethod, equalsTo(matcher), 3, 'Method'))
    } else if (Array.isArray(matcher)) {
      notEmpty(matcher)
      noNullElements(matcher)

      this._meta.set('method', matcher.join(','))
      this._matchers.push(this.spec(extractMethod, anyItem(matcher), 3, 'Method'))
    } else {
      this._matchers.push(this.spec(extractMethod, matcher, 3, 'Method'))
    }

    return this
  }

  scheme(scheme: Schemes): this {
    this._matchers.push(this.spec(extractScheme, equalsTo(scheme), 1, 'Scheme'))

    return this
  }

  header(key: string, matcher: Matcher<string> | string): this {
    notBlank(key)
    notNull(matcher)

    if (typeof matcher === 'string') {
      this._matchers.push(
        this.spec(extractHeader(key.toLowerCase()), equalsTo(matcher), 0.5, 'Header')
      )
    } else {
      this._matchers.push(this.spec(extractHeader(key.toLowerCase()), matcher, 0.5, 'Header'))
    }

    return this
  }

  headers(matcher: Matcher<Record<string, string>>): this {
    notNull(matcher)

    this._matchers.push(this.spec(extractHeaders, matcher, 3, 'Header'))

    return this
  }

  contentType(matcher: Matcher<string> | string): this {
    notNull(matcher)

    if (typeof matcher === 'string') {
      this._matchers.push(
        this.spec(extractHeader(Headers.ContentType), equalsTo(matcher), 0.5, 'Header')
      )
    } else {
      this._matchers.push(this.spec(extractHeader(Headers.ContentType), matcher, 0.5, 'Header'))
    }

    return this
  }

  basicAuthorization(username: string, password: string): this {
    notNull(username)
    notNull(password)

    this._matchers.push(
      this.spec(
        extractHeader(Headers.Authorization),
        equalsTo(encodeBase64(`Basic ${username}:${password}`)),
        0.5,
        'Header'
      )
    )

    return this
  }

  bearerAuthorization(token: string): this {
    notNull(token)

    this._matchers.push(this.spec(extractRequest, bearerToken(token), 0.5, 'Header'))

    return this
  }

  query(key: string, matcher: Matcher<string | string[] | undefined> | string): this {
    notBlank(key)
    notNull(matcher)

    if (typeof matcher === 'string') {
      this._matchers.push(
        this.spec(extractQuery(key), equalsTo<string | string[] | undefined>(matcher), 0.5, 'Query')
      )
    } else {
      this._matchers.push(this.spec(extractQuery(key), matcher, 0.5, 'Query'))
    }

    return this
  }

  querystring(matcher: Matcher<Record<string, string | string[] | undefined>>): this {
    notNull(matcher)

    this._matchers.push(this.spec(extractQueries, matcher, 3, 'Query'))

    return this
  }

  requestBody(...matchers: Array<Matcher<BodyType>>): this {
    notEmpty(matchers)
    noNullElements(matchers)

    if (matchers.length === 0) {
      this._matchers.push(this.spec(extractBody, matchers[0], 5, 'Body'))
    }

    this._matchers.push(this.spec(extractBody, allOf(...matchers), 5, 'Body'))

    return this
  }

  requestFields(...matchers: Array<Matcher<BodyType>>): this {
    return this.requestBody(...matchers)
  }

  files(...matchers: Array<Matcher<Array<Express.Multer.File>>>): this {
    notEmpty(matchers)
    noNullElements(matchers)

    if (matchers.length === 0) {
      this._matchers.push(this.spec(extractMultiPartFiles, matchers[0], 3, 'Files'))
    }

    this._matchers.push(this.spec(extractMultiPartFiles, allOf(...matchers), 5, 'Files'))

    return this
  }

  file(fieldName: string, ...matchers: Array<Matcher<Express.Multer.File | undefined>>): this {
    notBlank(fieldName)
    notEmpty(matchers)
    noNullElements(matchers)

    if (matchers.length === 0) {
      this._matchers.push(this.spec(extractFileByFieldName(fieldName), matchers[0], 3, 'Files'))
    }

    this._matchers.push(
      this.spec(extractFileByFieldName(fieldName), allOf(...matchers), 5, 'Files')
    )

    return this
  }

  cookie(key: string, matcher: Matcher<string> | string): this {
    if (typeof matcher === 'string') {
      this._matchers.push(
        this.spec(extractCookie(key), equalsTo<string | undefined>(matcher), 0.5, 'Cookies')
      )
    } else {
      this._matchers.push(this.spec(extractCookie(key) as any, matcher, 0.5, 'Cookies'))
    }

    return this
  }

  cookieJson(key: string, matcher: Matcher<Record<string, unknown>> | string): this {
    if (typeof matcher === 'string') {
      this._matchers.push(
        this.spec(extractCookieAsJson(key), equalsTo<string | undefined>(matcher), 0.5, 'Cookies')
      )
    } else {
      this._matchers.push(this.spec(extractCookieAsJson(key) as any, matcher, 0.5, 'Cookies'))
    }

    return this
  }

  repeatTimes(times: number): this {
    notNull(times)

    this._matchers.push(this.spec(extractNothing, repeatTimes(times), 0, 'Times'))

    return this
  }

  expect(...matchers: Array<Matcher<HttpRequest> | Matcher<unknown> | Matcher>): this {
    notEmpty(matchers)
    noNullElements(matchers)

    if (matchers.length === 1) {
      this._matchers.push(this.spec(extractRequest, matchers[0] as Matcher<unknown>, 1, 'Request'))
    } else {
      this._matchers.push(
        this.spec(extractRequest, allOf(...(matchers as Array<Matcher<unknown>>)), 1, 'Request')
      )
    }

    return this
  }

  proxyTo(target: string, response: HttpResponseFixtureBuilder): this {
    response.proxyFrom(target)

    this._responseBuilder = response.build()

    return this
  }

  reply(response: HttpResponseFixtureBuilder | HttpResponseFixtureBuilderFunction): this {
    this._responseBuilder =
      response instanceof HttpResponseFixtureBuilder ? response.build() : response
    return this
  }

  build(context: HttpContext): HttpMock {
    notNull(context)

    this.validate()

    return new HttpMock(
      this._id,
      this._name,
      this._priority,
      this._source,
      this._sourceDescription,
      this._matchers,
      this._responseBuilder,
      this._meta,
      new Map<string, unknown>(),
      this._scenarioName
        ? {
            name: this._scenarioName,
            requiredState: this._scenarioRequiredState,
            newState: this._scenarioNewState
          }
        : undefined
    )
  }

  validate(): void {
    notEmpty(this._matchers, 'Mocks needs to have at least one Matcher.')
    noNullElements(this._matchers, 'Matchers list must not contain null or undefined elements.')
    notNull(this._responseBuilder, 'Response definition is required. Call .reply() to create one.')
  }
}
