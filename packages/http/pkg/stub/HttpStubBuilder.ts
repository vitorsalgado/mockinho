import { Express } from 'express'
import { allOf, equalsTo, hitTimes } from '@mockinho/core-matchers'
import { encodeBase64 } from '@mockinho/core'
import { Matcher } from '@mockinho/core'
import { notNull } from '@mockinho/core'
import { noNullElements } from '@mockinho/core'
import { StubSource } from '@mockinho/core'
import { notBlank } from '@mockinho/core'
import { MockinhoError } from '@mockinho/core'
import { notEmpty } from '@mockinho/core'
import { StubBaseBuilder } from '@mockinho/core'
import { DecoratedStubBuilder } from '../types'
import { BodyType, ErrorCodes, Headers, HttpMethods } from '../types'
import { bearerToken, urlPath } from '../matchers'
import { HttpRequest } from '../HttpRequest'
import { HttpContext } from '../HttpContext'
import { HttpStub, HttpStubMeta } from './HttpStub'
import { HttpResponseDefinitionBuilder } from './HttpResponseDefinitionBuilder'
import { HttpResponseDefinition } from './HttpResponseDefinition'

const extractRequest = (request: HttpRequest): HttpRequest => request
const extractMethod = (request: HttpRequest): HttpMethods => request.method
const extractUrl = (request: HttpRequest): string => request.href
const extractBody = (request: HttpRequest): BodyType => request.body
const extractHeader =
  (key: string) =>
  (request: HttpRequest): string =>
    request.headers[key]
const extractHeaders = (request: HttpRequest): Record<string, string> => request.headers
const extractQuery =
  (key: string) =>
  (request: HttpRequest): string | string[] | undefined =>
    request.query[key]
const extractQueries = (request: HttpRequest): Record<string, string | string[] | undefined> =>
  request.query
const extractNothing = () => undefined
const extractMultiPartFiles = (request: HttpRequest): Array<Express.Multer.File> => request.files
const extractFileByFieldName =
  (field: string) =>
  (request: HttpRequest): Express.Multer.File | undefined =>
    request.files.find(x => x.fieldname === field)

export class InvalidStubConfigurationError extends MockinhoError {
  constructor(message: string) {
    super(message, ErrorCodes.MR_ERR_INVALID_STUB_CONFIG)
  }
}

export class HttpStubBuilder extends StubBaseBuilder<
  HttpContext,
  HttpRequest,
  HttpResponseDefinition,
  HttpResponseDefinitionBuilder,
  HttpStub
> {
  private readonly meta: HttpStubMeta = {}

  constructor(
    private readonly _source: StubSource = 'code',
    private readonly _sourceDescription: string = ''
  ) {
    super()
  }

  static newBuilder = (): DecoratedStubBuilder => new HttpStubBuilder() as DecoratedStubBuilder

  url(matcher: Matcher<string> | string): this {
    notNull(matcher)

    if (typeof matcher === 'string') {
      notBlank(matcher)

      this.meta.url = matcher

      const m = urlPath(matcher)
      m.context = 'request'
      m.key = 'url'
      m.expectation = [matcher]

      this._matchers.push(this.spec(extractUrl, m))
    } else {
      matcher.context = 'request'
      matcher.key = 'url'

      this._matchers.push(this.spec(extractUrl, matcher, 10))
    }

    return this
  }

  method(matcher: Matcher<string> | string): this {
    notNull(matcher)

    if (typeof matcher === 'string') {
      notBlank(matcher)

      this.meta.method = matcher

      const m = equalsTo(matcher)
      m.context = 'request'
      m.key = 'method'
      m.expectation = [matcher]

      this._matchers.push(this.spec(extractMethod, m, 3))
    } else {
      matcher.context = 'request'
      matcher.key = 'method'

      this._matchers.push(this.spec(extractMethod, matcher, 3))
    }

    return this
  }

  header(key: string, matcher: Matcher<string> | string): this {
    notBlank(key)
    notNull(matcher)

    if (typeof matcher === 'string') {
      this._matchers.push(this.spec(extractHeader(key.toLowerCase()), equalsTo(matcher), 0.5))
    } else {
      this._matchers.push(this.spec(extractHeader(key.toLowerCase()), matcher, 0.5))
    }

    return this
  }

  headers(matcher: Matcher<Record<string, string>>): this {
    notNull(matcher)

    this._matchers.push(this.spec(extractHeaders, matcher, 3))

    return this
  }

  contentType(matcher: Matcher<string> | string): this {
    notNull(matcher)

    if (typeof matcher === 'string') {
      this._matchers.push(this.spec(extractHeader(Headers.ContentType), equalsTo(matcher), 0.5))
    } else {
      this._matchers.push(this.spec(extractHeader(Headers.ContentType), matcher, 0.5))
    }

    return this
  }

  basicAuthorization(username: string, password: string): this {
    notNull(username)
    notNull(password)

    this._matchers.push(
      this.spec(
        extractHeader(Headers.Authorization),
        equalsTo(encodeBase64(`Basic ${username}:${password}`))
      )
    )

    return this
  }

  bearerAuthorization(token: string): this {
    notNull(token)

    this._matchers.push(this.spec(extractRequest, bearerToken(token)))

    return this
  }

  query(key: string, matcher: Matcher<string | string[] | undefined> | string): this {
    notBlank(key)
    notNull(matcher)

    if (typeof matcher === 'string') {
      this._matchers.push(this.spec(extractQuery(key) as any, equalsTo(matcher), 0.5))
    } else {
      this._matchers.push(this.spec(extractQuery(key), matcher, 0.5))
    }

    return this
  }

  queries(matcher: Matcher<Record<string, string | string[] | undefined>>): this {
    notNull(matcher)

    this._matchers.push(this.spec(extractQueries, matcher, 3))

    return this
  }

  requestBody(...matchers: Array<Matcher<BodyType>>): this {
    notEmpty(matchers)
    noNullElements(matchers)

    if (matchers.length === 0) {
      this._matchers.push(this.spec(extractBody, matchers[0], 5))
    }

    this._matchers.push(this.spec(extractBody, allOf(...matchers), 5))

    return this
  }

  requestFields(...matchers: Array<Matcher<BodyType>>): this {
    return this.requestBody(...matchers)
  }

  files(...matchers: Array<Matcher<Array<Express.Multer.File>>>): this {
    notEmpty(matchers)
    noNullElements(matchers)

    if (matchers.length === 0) {
      this._matchers.push(this.spec(extractMultiPartFiles, matchers[0], 3))
    }

    this._matchers.push(this.spec(extractMultiPartFiles, allOf(...matchers), 5))

    return this
  }

  file(fieldName: string, ...matchers: Array<Matcher<Express.Multer.File | undefined>>): this {
    notBlank(fieldName)
    notEmpty(matchers)
    noNullElements(matchers)

    if (matchers.length === 0) {
      this._matchers.push(this.spec(extractFileByFieldName(fieldName), matchers[0], 3))
    }

    this._matchers.push(this.spec(extractFileByFieldName(fieldName), allOf(...matchers), 5))

    return this
  }

  hitTimes(times: number): this {
    notNull(times)

    this._matchers.push(this.spec(extractNothing, hitTimes(times)))

    return this
  }

  expect(...matchers: Array<Matcher<HttpRequest>>): this {
    notEmpty(matchers)
    noNullElements(matchers)

    if (matchers.length === 1) {
      this._matchers.push(this.spec(extractRequest, matchers[0], 1))
    }

    this._matchers.push(this.spec(extractRequest, allOf(...matchers), 1))

    return this
  }

  build(context: HttpContext): HttpStub {
    notNull(context)

    this.validate()
    this._responseDefinitionBuilder.validate(context)

    return new HttpStub(
      this._id,
      this._name,
      this._priority,
      this._source,
      this._sourceDescription,
      this._matchers,
      this._responseDefinitionBuilder,
      this.meta,
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
    notEmpty(this._matchers, 'Stubs needs to have at least one Matcher.')
    noNullElements(this._matchers, 'Matchers list must not contain null or undefined elements.')
    notNull(
      this._responseDefinitionBuilder,
      'Response definition is required. Call .reply() to create one.'
    )
  }
}
