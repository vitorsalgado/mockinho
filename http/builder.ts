import http from 'node:http'
import {
  MatcherSpecification,
  MockBuilder,
  MockSource,
  State,
  stateMatcher,
  StateRepository,
} from '@mockdog/core'
import {
  allOf,
  anyItem,
  equalTo,
  Matcher,
  Predicate,
  repeat,
  fromPredicate,
  oneOf,
} from '@mockdog/matchers'
import { base64, JsonType, noNullElements, notBlank, notEmpty, notNull, Nullable } from '@mockdog/x'
import { basicAuth, bearerToken, urlPath } from './feat/matchers/index.js'
import { BodyType, H, Methods, Schemes } from './http.js'
import { newReply } from './reply/index.js'
import { SrvRequest } from './request.js'
import { HttpMock } from './mock.js'
import { Reply, ReplyFn, wrapReply } from './reply/reply.js'
import { selector } from './_internal/request_value_selectors.js'

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

      this._expectations.push(
        this.spec(makeTarget('url', matcher), selector.url, urlPath(matcher), 10),
      )
    } else {
      this._expectations.push(this.spec('url', selector.url, matcher, 10))
    }

    return this
  }

  method(...method: Methods[]): this {
    notNull(method)

    this._expectations.push(
      this.spec(makeTarget('method', method.join(',')), selector.method, anyItem(...method), 3),
    )

    return this
  }

  scheme(...scheme: Schemes[]): this {
    this._expectations.push(
      this.spec(makeTarget('scheme', scheme.join(',')), selector.scheme, oneOf(scheme), 1),
    )

    return this
  }

  header(
    key: string,
    matcher: Predicate<Nullable<string>> | Matcher<Nullable<string>> | string,
  ): this {
    notBlank(key)
    notNull(matcher)

    const target = `header(${key})`

    if (typeof matcher === 'string') {
      this._expectations.push(
        this.spec(target, selector.header(key.toLowerCase()), equalTo(matcher, true), 0.5),
      )
    } else {
      this._expectations.push(this.spec(target, selector.header(key), fromPredicate(matcher), 0.5))
    }

    return this
  }

  headers(matcher: Matcher<http.IncomingHttpHeaders> | Predicate<http.IncomingHttpHeaders>): this {
    notNull(matcher)

    this._expectations.push(this.spec('headers', selector.headers, fromPredicate(matcher), 3))

    return this
  }

  contentType(matcher: Predicate<Nullable<string>> | Matcher<Nullable<string>> | string): this {
    notNull(matcher)

    const target = makeTarget('header', 'content-type')

    if (typeof matcher === 'string') {
      this._expectations.push(
        this.spec(target, selector.header(H.ContentType), equalTo(matcher, true), 0.5),
      )
    } else {
      this._expectations.push(
        this.spec(target, selector.header(H.ContentType), fromPredicate(matcher), 0.5),
      )
    }

    return this
  }

  basicAuth(username: string | Matcher<string>, password: string = ''): this {
    notNull(username)
    notNull(password)

    const encoded = base64.encode(`${username}:${password}`)

    this._expectations.push(
      this.spec(
        makeTarget('basic_auth', encoded),
        selector.request,
        basicAuth(username, password),
        0.5,
      ),
    )

    return this
  }

  bearerToken(token: string): this {
    notNull(token)

    this._expectations.push(
      this.spec(makeTarget('bearer_token', token), selector.request, bearerToken(token), 0.5),
    )

    return this
  }

  query(
    key: string,
    matcher: Predicate<Nullable<string>> | Matcher<Nullable<string>> | string,
  ): this {
    notBlank(key)
    notNull(matcher)

    const target = makeTarget('query', key)

    if (typeof matcher === 'string') {
      this._expectations.push(this.spec(target, selector.query(key), equalTo(matcher), 0.5))
    } else {
      this._expectations.push(this.spec(target, selector.query(key), fromPredicate(matcher), 0.5))
    }

    return this
  }

  queries(key: string, matcher: Predicate<Array<string>> | Matcher<Array<string>> | string): this {
    notBlank(key)
    notNull(matcher)

    const target = makeTarget('query', key)

    if (typeof matcher === 'string') {
      this._expectations.push(this.spec(target, selector.queries(key), equalTo(matcher), 0.5))
    } else {
      this._expectations.push(this.spec(target, selector.queries(key), fromPredicate(matcher), 0.5))
    }

    return this
  }

  querystring(matcher: Matcher<URLSearchParams>): this {
    notNull(matcher)

    this._expectations.push(this.spec('querystring', selector.fullQuerystring, matcher, 3))

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
      this._expectations.push(this.spec('files', selector.files, fromPredicate(matchers[0]), 3))
    }

    this._expectations.push(
      this.spec('files', selector.files, allOf(...matchers.map(x => fromPredicate(x))), 5),
    )

    return this
  }

  file(field: string, ...matchers: Array<Matcher<Express.Multer.File | undefined>>): this {
    notBlank(field)
    notEmpty(matchers)
    noNullElements(matchers)

    const target = makeTarget('file', field)

    if (matchers.length === 0) {
      this._expectations.push(this.spec(target, selector.fileByFieldName(field), matchers[0], 3))
    }

    this._expectations.push(
      this.spec(target, selector.fileByFieldName(field), allOf(...matchers), 5),
    )

    return this
  }

  cookie(
    name: string,
    matcher: Predicate<Nullable<string>> | Matcher<Nullable<string>> | string,
  ): this {
    const target = makeTarget('cookie', name)

    if (typeof matcher === 'string') {
      this._expectations.push(this.spec(target, selector.cookie(name), equalTo(matcher), 0.5))
    } else {
      this._expectations.push(this.spec(target, selector.cookie(name), fromPredicate(matcher), 0.5))
    }

    return this
  }

  cookieJson(
    name: string,
    matcher: Predicate<Nullable<JsonType>> | Matcher<Nullable<JsonType>>,
  ): this {
    this._expectations.push(
      this.spec(
        makeTarget('cookieJSON', name),
        selector.jsonCookie(name),
        fromPredicate(matcher),
        0.5,
      ),
    )

    return this
  }

  repeat(times: number): this {
    notNull(times)

    this._expectations.push(
      this.spec(makeTarget('request', times), selector.nothing, repeat(times), 0),
    )

    return this
  }

  expect(...matchers: Array<Predicate<SrvRequest> | Matcher<SrvRequest>>): this {
    notEmpty(matchers)
    noNullElements(matchers)

    this._expectations.push(
      this.spec('request', selector.request, allOf(...matchers.map(x => fromPredicate(x))), 1),
    )

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

  /**
   * Reply a mocked response with the given specification
   *
   * @param reply - Mock response specification.
   * @param body - Response body. Will only be considered if the first parameter is a number.
   */
  reply(reply: Reply | ReplyFn | number, body?: BodyType): this {
    if (typeof reply === 'number') {
      this._reply = newReply().status(reply).body(body)
    } else {
      this._reply = wrapReply(reply)
    }

    return this
  }

  build(deps: Deps): HttpMock {
    this.validate()

    if (this._scenario) {
      this._expectations.push(
        this.spec(
          makeTarget('state', this._scenario),
          selector.nothing,
          stateMatcher(deps.stateRepository)(
            this._scenario,
            this._scenarioRequiredState,
            this._scenarioNewState,
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
    matcher: Matcher<M>,
    score: number = 0,
  ): MatcherSpecification<unknown, unknown> {
    return {
      target,
      matcher,
      selector,
      score,
    } as MatcherSpecification<unknown, unknown>
  }

  private validate(): void {
    notEmpty(this._expectations, 'Mocks needs to have at least one Matcher.')
    noNullElements(this._expectations, 'Matchers list must not contain null or undefined elements.')
    notNull(this._reply, 'Response definition is required. Call .reply() to create one.')
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

function forMethod(method: Methods, urlMatcher: Matcher<string> | string): HttpMockBuilder {
  return HttpMockBuilder.newBuilder().method(method).url(urlMatcher)
}

function makeTarget(target: string, param: unknown): string {
  return `${target}(${param})`
}
