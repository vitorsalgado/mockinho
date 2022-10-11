import {
  MatcherSpecification,
  MockBuilder,
  MockSource,
  State,
  stateMatcher,
  StateRepository,
} from '@mockdog/core'
import { allOf, anyItem, equalTo, Matcher, Predicate, repeatTimes, wrap } from '@mockdog/matchers'
import { base64, JsonType, noNullElements, notBlank, notEmpty, notNull, Nullable } from '@mockdog/x'
import { bearerToken, urlPath } from '../features/matchers/index.js'
import { BodyType, H, Methods, Schemes } from '../http.js'
import { SrvRequest } from '../request.js'
import { HttpMock } from './httpmock.js'
import { ForwardReply } from './reply/forward.js'
import { Reply, ReplyFn, wrapReply } from './reply/reply.js'
import { selector } from './request_value_selectors.js'

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
  private _reply!: Reply

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
      this._expectations.push(this.spec('url', selector.url, urlPath(matcher), 10))
    } else {
      this._expectations.push(this.spec('url', selector.url, matcher, 10))
    }

    return this
  }

  method(...method: Methods[]): this {
    notNull(method)

    this._expectations.push(this.spec('method', selector.method, anyItem(...method), 3))

    return this
  }

  scheme(scheme: Schemes): this {
    this._expectations.push(this.spec('scheme', selector.scheme, equalTo(scheme), 1))

    return this
  }

  header(key: string, matcher: Matcher<string> | string): this {
    notBlank(key)
    notNull(matcher)

    if (typeof matcher === 'string') {
      this._expectations.push(
        this.spec('header', selector.header(key.toLowerCase()), equalTo(matcher), 0.5),
      )
    } else {
      this._expectations.push(this.spec('header', selector.header(key.toLowerCase()), matcher, 0.5))
    }

    return this
  }

  headers(matcher: Matcher<Record<string, string>>): this {
    notNull(matcher)

    this._expectations.push(this.spec('header', selector.headers, matcher, 3))

    return this
  }

  contentType(matcher: Matcher<string> | string): this {
    notNull(matcher)

    if (typeof matcher === 'string') {
      this._expectations.push(
        this.spec('header', selector.header(H.ContentType), equalTo(matcher), 0.5),
      )
    } else {
      this._expectations.push(this.spec('header', selector.header(H.ContentType), matcher, 0.5))
    }

    return this
  }

  basicAuth(username: string, password: string): this {
    notNull(username)
    notNull(password)

    this._expectations.push(
      this.spec(
        'basic auth',
        selector.header(H.Authorization),
        equalTo(base64.encode(`Basic ${username}:${password}`)),
        0.5,
      ),
    )

    return this
  }

  bearerToken(token: string): this {
    notNull(token)

    this._expectations.push(this.spec('bearer token', selector.request, bearerToken(token), 0.5))

    return this
  }

  query(
    key: string,
    matcher: Predicate<Nullable<string>> | Matcher<Nullable<string>> | string,
  ): this {
    notBlank(key)
    notNull(matcher)

    if (typeof matcher === 'string') {
      this._expectations.push(this.spec('query', selector.query(key), equalTo(matcher), 0.5))
    } else {
      this._expectations.push(this.spec('query', selector.query(key), wrap(matcher), 0.5))
    }

    return this
  }

  queries(key: string, matcher: Predicate<Array<string>> | Matcher<Array<string>> | string): this {
    notBlank(key)
    notNull(matcher)

    if (typeof matcher === 'string') {
      this._expectations.push(this.spec('query', selector.queries(key), equalTo(matcher), 0.5))
    } else {
      this._expectations.push(this.spec('query', selector.queries(key), wrap(matcher), 0.5))
    }

    return this
  }

  querystring(matcher: Matcher<URLSearchParams>): this {
    notNull(matcher)

    this._expectations.push(this.spec('query', selector.fullQuerystring, matcher, 3))

    return this
  }

  requestBody(...matchers: Array<Matcher<BodyType>>): this {
    notEmpty(matchers)
    noNullElements(matchers)

    if (matchers.length === 0) {
      this._expectations.push(this.spec('body', selector.body, matchers[0], 5))
    }

    this._expectations.push(this.spec('body', selector.body, allOf(...matchers), 5))

    return this
  }

  fields(...matchers: Array<Matcher<BodyType>>): this {
    return this.requestBody(...matchers)
  }

  files(
    ...matchers: Array<Matcher<Array<Express.Multer.File>> | Predicate<Array<Express.Multer.File>>>
  ): this {
    notEmpty(matchers)
    noNullElements(matchers)

    if (matchers.length === 0) {
      this._expectations.push(this.spec('file', selector.files, wrap(matchers[0]), 3))
    }

    this._expectations.push(
      this.spec('file', selector.files, allOf(...matchers.map(x => wrap(x))), 5),
    )

    return this
  }

  file(fieldName: string, ...matchers: Array<Matcher<Express.Multer.File | undefined>>): this {
    notBlank(fieldName)
    notEmpty(matchers)
    noNullElements(matchers)

    if (matchers.length === 0) {
      this._expectations.push(
        this.spec('file', selector.fileByFieldName(fieldName), matchers[0], 3),
      )
    }

    this._expectations.push(
      this.spec('file', selector.fileByFieldName(fieldName), allOf(...matchers), 5),
    )

    return this
  }

  cookie(key: string, matcher: Matcher<string> | string): this {
    if (typeof matcher === 'string') {
      this._expectations.push(
        this.spec('cookie', selector.cookie(key) as any, equalTo(matcher), 0.5),
      )
    } else {
      this._expectations.push(this.spec('cookie', selector.cookie(key) as any, matcher, 0.5))
    }

    return this
  }

  cookieJson(key: string, matcher: Matcher<JsonType> | string): this {
    if (typeof matcher === 'string') {
      this._expectations.push(
        this.spec('cookie', selector.jsonCookie(key) as any, equalTo(matcher), 0.5),
      )
    } else {
      this._expectations.push(this.spec('cookie', selector.jsonCookie(key) as any, matcher, 0.5))
    }

    return this
  }

  repeat(times: number): this {
    notNull(times)

    this._expectations.push(this.spec('request', selector.nothing, repeatTimes(times), 0))

    return this
  }

  expect(...matchers: Array<Predicate | Matcher>): this {
    notEmpty(matchers)
    noNullElements(matchers)

    if (matchers.length === 1) {
      this._expectations.push(this.spec('request', selector.request, wrap(matchers[0]), 1))
    } else {
      this._expectations.push(
        this.spec('request', selector.request, allOf(...matchers.map(x => wrap(x))), 1),
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

  proxyTo(target: string, reply: ForwardReply): this {
    this._reply = reply.target(target)
    return this
  }

  reply(reply: Reply | ReplyFn): this {
    this._reply = wrapReply(reply)
    return this
  }

  validate(): void {
    notEmpty(this._expectations, 'Mocks needs to have at least one Matcher.')
    noNullElements(this._expectations, 'Matchers list must not contain null or undefined elements.')
    notNull(this._reply, 'Response definition is required. Call .reply() to create one.')
  }

  build(deps: Deps): HttpMock {
    this.validate()

    if (this._scenario) {
      this._expectations.push(
        this.spec(
          'state',
          selector.nothing,
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
      this._reply,
    )
  }

  private spec<T, M = T>(
    target: string,
    selector: (request: SrvRequest) => T,
    matcher: Matcher<M> | Predicate<M>,
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

export const anyMethod = (urlMatcher: Matcher<string> | string): HttpMockBuilder =>
  HttpMockBuilder.newBuilder().url(urlMatcher)
export const del = (urlMatcher: Matcher<string> | string): HttpMockBuilder =>
  forMethod('DELETE', urlMatcher)
export const get = (urlMatcher: Matcher<string> | string): HttpMockBuilder =>
  forMethod('GET', urlMatcher)
export const head = (urlMatcher: Matcher<string> | string): HttpMockBuilder =>
  forMethod('HEAD', urlMatcher)
export const patch = (urlMatcher: Matcher<string> | string): HttpMockBuilder =>
  forMethod('PATCH', urlMatcher)
export const put = (urlMatcher: Matcher<string> | string): HttpMockBuilder =>
  forMethod('PUT', urlMatcher)
export const post = (urlMatcher: Matcher<string> | string): HttpMockBuilder =>
  forMethod('POST', urlMatcher)
export const request = (urlMatcher: Matcher<string> | string): HttpMockBuilder =>
  HttpMockBuilder.newBuilder().url(urlMatcher)

const forMethod = (method: Methods, urlMatcher: Matcher<string> | string): HttpMockBuilder =>
  HttpMockBuilder.newBuilder().method(method).url(urlMatcher)
