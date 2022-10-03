import {
  MatcherSpecification,
  MockBuilder,
  MockSource,
  State,
  stateMatcher,
  StateRepository,
} from '@mockdog/core'
import { allOf, anyItem, equalsTo, repeatTimes, wrap, Matcher, Predicate } from '@mockdog/matchers'
import { base64, JsonType, noNullElements, notBlank, notEmpty, notNull } from '@mockdog/x'
import { BodyType, Headers, Methods, Schemes } from '../http.js'
import { bearerToken, urlPath } from '../matchers/index.js'
import { HttpMock } from './HttpMock.js'
import { ResponseBuilder } from './ResponseBuilder.js'
import { ResponseDelegate } from './ResponseDelegate.js'
import {
  extractBody,
  extractCookie,
  extractCookieAsJson,
  extractFileByFieldName,
  extractHeader,
  extractHeaders,
  extractMethod,
  extractMultiPartFiles,
  extractNothing,
  extractQueries,
  extractQuery,
  extractRequest,
  extractScheme,
  extractUrl,
} from './util/extractors.js'

export interface Deps {
  stateRepository: StateRepository
}

export class HttpMockBuilder implements MockBuilder<HttpMock, Deps> {
  private _id: string = ''
  private _name: string = ''
  private _priority: number = 0
  private _scenario: string = ''
  private _scenarioNewState: string = State.STATE_STARTED
  private _scenarioRequiredState: string = ''
  private readonly _expectations: Array<MatcherSpecification<unknown, unknown>> = []
  private _responseBuilder!: ResponseDelegate

  constructor(
    private readonly _source: MockSource = 'code',
    private readonly _sourceDescription: string = '',
  ) {}

  static newBuilder = (source: MockSource = 'code', sourceDescription = ''): HttpMockBuilder =>
    new HttpMockBuilder(source, sourceDescription)

  id(id: string): this {
    this._id = id
    return this
  }

  name(name: string): this {
    this._name = name
    return this
  }

  priority(priority: number): this {
    this._priority = priority
    return this
  }

  url(matcher: Matcher<string> | string): this {
    notNull(matcher)

    if (typeof matcher === 'string') {
      notBlank(matcher)
      this._expectations.push(this.spec('url', extractUrl, urlPath(matcher), 10))
    } else {
      this._expectations.push(this.spec('url', extractUrl, matcher, 10))
    }

    return this
  }

  method(...method: Methods[]): this {
    notNull(method)

    this._expectations.push(this.spec('method', extractMethod, anyItem(...method), 3))

    return this
  }

  scheme(scheme: Schemes): this {
    this._expectations.push(this.spec('scheme', extractScheme, equalsTo(scheme), 1))

    return this
  }

  header(key: string, matcher: Matcher<string> | string): this {
    notBlank(key)
    notNull(matcher)

    if (typeof matcher === 'string') {
      this._expectations.push(
        this.spec('header', extractHeader(key.toLowerCase()), equalsTo(matcher), 0.5),
      )
    } else {
      this._expectations.push(this.spec('header', extractHeader(key.toLowerCase()), matcher, 0.5))
    }

    return this
  }

  headers(matcher: Matcher<Record<string, string>>): this {
    notNull(matcher)

    this._expectations.push(this.spec('header', extractHeaders, matcher, 3))

    return this
  }

  contentType(matcher: Matcher<string> | string): this {
    notNull(matcher)

    if (typeof matcher === 'string') {
      this._expectations.push(
        this.spec('header', extractHeader(Headers.ContentType), equalsTo(matcher), 0.5),
      )
    } else {
      this._expectations.push(this.spec('header', extractHeader(Headers.ContentType), matcher, 0.5))
    }

    return this
  }

  basicAuth(username: string, password: string): this {
    notNull(username)
    notNull(password)

    this._expectations.push(
      this.spec(
        'basic auth',
        extractHeader(Headers.Authorization),
        equalsTo(base64.encode(`Basic ${username}:${password}`)),
        0.5,
      ),
    )

    return this
  }

  bearerToken(token: string): this {
    notNull(token)

    this._expectations.push(this.spec('bearer token', extractRequest, bearerToken(token), 0.5))

    return this
  }

  query(key: string, matcher: Matcher<string[]> | Matcher<string> | string | string[]): this {
    notBlank(key)
    notNull(matcher)

    if (typeof matcher === 'string') {
      this._expectations.push(this.spec('query', extractQuery(key) as any, equalsTo(matcher), 0.5))
    } else {
      this._expectations.push(this.spec('query', extractQuery(key) as any, matcher as any, 0.5))
    }

    return this
  }

  querystring(matcher: Matcher<Record<string, string | string[] | undefined>>): this {
    notNull(matcher)

    this._expectations.push(this.spec('query', extractQueries, matcher, 3))

    return this
  }

  requestBody(...matchers: Array<Matcher<BodyType>>): this {
    notEmpty(matchers)
    noNullElements(matchers)

    if (matchers.length === 0) {
      this._expectations.push(this.spec('body', extractBody, matchers[0], 5))
    }

    this._expectations.push(this.spec('body', extractBody, allOf(...matchers), 5))

    return this
  }

  requestFields(...matchers: Array<Matcher<BodyType>>): this {
    return this.requestBody(...matchers)
  }

  files(
    ...matchers: Array<Matcher<Array<Express.Multer.File>> | Predicate<Array<Express.Multer.File>>>
  ): this {
    notEmpty(matchers)
    noNullElements(matchers)

    if (matchers.length === 0) {
      this._expectations.push(this.spec('file', extractMultiPartFiles, wrap(matchers[0]), 3))
    }

    this._expectations.push(
      this.spec('file', extractMultiPartFiles, allOf(...matchers.map(x => wrap(x))), 5),
    )

    return this
  }

  file(fieldName: string, ...matchers: Array<Matcher<Express.Multer.File | undefined>>): this {
    notBlank(fieldName)
    notEmpty(matchers)
    noNullElements(matchers)

    if (matchers.length === 0) {
      this._expectations.push(this.spec('file', extractFileByFieldName(fieldName), matchers[0], 3))
    }

    this._expectations.push(
      this.spec('file', extractFileByFieldName(fieldName), allOf(...matchers), 5),
    )

    return this
  }

  cookie(key: string, matcher: Matcher<string> | string): this {
    if (typeof matcher === 'string') {
      this._expectations.push(
        this.spec('cookie', extractCookie(key) as any, equalsTo(matcher), 0.5),
      )
    } else {
      this._expectations.push(this.spec('cookie', extractCookie(key) as any, matcher, 0.5))
    }

    return this
  }

  cookieJson(key: string, matcher: Matcher<JsonType> | string): this {
    if (typeof matcher === 'string') {
      this._expectations.push(
        this.spec('cookie', extractCookieAsJson(key) as any, equalsTo(matcher), 0.5),
      )
    } else {
      this._expectations.push(this.spec('cookie', extractCookieAsJson(key) as any, matcher, 0.5))
    }

    return this
  }

  repeatTimes(times: number): this {
    notNull(times)

    this._expectations.push(this.spec('request', extractNothing, repeatTimes(times), 0))

    return this
  }

  expect(...matchers: Array<Predicate | Matcher>): this {
    notEmpty(matchers)
    noNullElements(matchers)

    if (matchers.length === 1) {
      this._expectations.push(this.spec('request', extractRequest, wrap(matchers[0]), 1))
    } else {
      this._expectations.push(
        this.spec('request', extractRequest, allOf(...matchers.map(x => wrap(x))), 1),
      )
    }

    return this
  }

  newScenario(name: string, newState: string = ''): this {
    this._scenario = name
    this._scenarioRequiredState = newState
    return this
  }

  scenarioIs(name: string): this {
    this._scenario = name
    return this
  }

  scenarioStateIs(requiredState: string): this {
    this._scenarioRequiredState = requiredState
    return this
  }

  scenarioWillBe(newState: string): this {
    this._scenarioNewState = newState
    return this
  }

  scenario(name: string, requiredState: string = State.STATE_STARTED, newState: string = ''): this {
    this._scenario = name
    this._scenarioRequiredState = requiredState
    this._scenarioNewState = newState
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

  validate(): void {
    notEmpty(this._expectations, 'Mocks needs to have at least one Matcher.')
    noNullElements(this._expectations, 'Matchers list must not contain null or undefined elements.')
    notNull(this._responseBuilder, 'Response definition is required. Call .reply() to create one.')
  }

  build(deps: Deps): HttpMock {
    this.validate()

    if (this._scenario) {
      this._expectations.push(
        this.spec(
          'state',
          extractNothing,
          wrap(
            stateMatcher(deps.stateRepository)(
              this._scenario,
              this._scenarioRequiredState,
              this._scenarioNewState,
            ),
          ),
        ),
      )
    }

    return new HttpMock(
      this._id,
      this._name,
      this._priority,
      this._source,
      this._sourceDescription,
      this._expectations,
      this._responseBuilder,
    )
  }

  private spec<T, V>(
    target: string,
    selector: (request: V) => T,
    matcher: Matcher<T> | Predicate<V>,
    score: number = 0,
  ): MatcherSpecification<unknown, unknown> {
    return {
      target,
      matcher,
      selector,
      score,
    } as MatcherSpecification<unknown, unknown>
  }
}
