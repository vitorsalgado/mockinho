import {
  encodeBase64,
  Matcher,
  MockinhoError,
  noNullElements,
  notBlank,
  notEmpty,
  notNull,
  StubBaseBuilder,
  StubSource
} from '@mockinho/core'
import { allOf, equalsTo, hitTimes } from '@mockinho/core-matchers'
import { HttpContext } from '../HttpContext'
import { HttpRequest } from '../HttpRequest'
import { bearerToken, urlPath } from '../matchers'
import { BodyType, ErrorCodes, Headers, HttpMethods } from '../types'
import { HttpResponseDefinition } from './HttpResponseDefinition'
import { HttpResponseDefinitionBuilder } from './HttpResponseDefinitionBuilder'
import { HttpStub, HttpStubMeta } from './HttpStub'

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

export class InvalidStubConfigurationError extends MockinhoError {
  constructor(message: string) {
    super(message, ErrorCodes.MR_ERR_INVALID_STUB_CONFIG)
  }
}

export class HttpStubBuilder extends StubBaseBuilder<
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

  static newBuilder = (): HttpStubBuilder => new HttpStubBuilder()

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

  method(matcher: Matcher<HttpMethods> | HttpMethods): this {
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

  build(context: HttpContext<any, any>): HttpStub {
    notNull(context)

    this.validate()

    return new HttpStub(
      this._id,
      this._name,
      this._priority,
      this._source,
      this._sourceDescription,
      this._matchers,
      this._responseDefinitionBuilder.build({
        fixturesPath: context.provideConfigurations().stubsDirectory,
        fixturesBodyPath: context.provideConfigurations().stubsBodyContentDirectory
      }),
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