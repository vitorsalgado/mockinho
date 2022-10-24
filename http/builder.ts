import http from 'node:http'
import {
  MatcherSpecification,
  MockBuilder,
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
import { score } from './_internal/score.js'
import { basicAuth, bearerToken, urlPath } from './feat/matchers/index.js'
import { BodyType, H, Methods, Schemes } from './http.js'
import { HttpReply, newReply } from './reply/index.js'
import { SrvRequest } from './request.js'
import { HttpMock } from './mock.js'
import { ReplyFn, wrapReply } from './reply/reply.js'
import { selector } from './_internal/request_value_selectors.js'

export interface Deps {
  stateRepository: StateRepository
}

export class HttpMockBuilder implements MockBuilder<HttpMock, Deps> {
  private readonly _mock
  private _scenario: string = ''
  private _scenarioNewState: string = State.STATE_STARTED
  private _scenarioRequiredState: string = ''

  constructor(source = 'code', sourceDetail: string = '') {
    this._mock = new HttpMock({ source, sourceDetail })
  }

  static newBuilder = (source = 'code', sourceDescription = ''): HttpMockBuilder =>
    new HttpMockBuilder(source, sourceDescription)

  id(id: string): this {
    this._mock.id = id
    return this
  }

  name(name: string): this {
    this._mock.name = name
    return this
  }

  priority(priority: number): this {
    this._mock.priority = priority
    return this
  }

  url(matcher: Matcher<string> | string): this {
    notNull(matcher)

    if (typeof matcher === 'string') {
      notBlank(matcher)

      this._mock.matchers.push(
        this.spec(makeTarget('url', matcher), selector.url, urlPath(matcher), score.High),
      )
    } else {
      this._mock.matchers.push(this.spec('url', selector.url, matcher, score.High))
    }

    return this
  }

  method(...method: Methods[]): this {
    notNull(method)

    this._mock.matchers.push(
      this.spec(
        makeTarget('method', method.join(',')),
        selector.method,
        anyItem(...method),
        score.Low,
      ),
    )

    return this
  }

  scheme(...scheme: Schemes[]): this {
    this._mock.matchers.push(
      this.spec(
        makeTarget('scheme', scheme.join(',')),
        selector.scheme,
        oneOf(scheme),
        score.VeryLow,
      ),
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
      this._mock.matchers.push(
        this.spec(
          target,
          selector.header(key.toLowerCase()),
          equalTo(matcher, true),
          score.VeryLow,
        ),
      )
    } else {
      this._mock.matchers.push(
        this.spec(target, selector.header(key), fromPredicate(matcher), score.VeryLow),
      )
    }

    return this
  }

  headers(matcher: Matcher<http.IncomingHttpHeaders> | Predicate<http.IncomingHttpHeaders>): this {
    notNull(matcher)

    this._mock.matchers.push(
      this.spec('headers', selector.headers, fromPredicate(matcher), score.Low),
    )

    return this
  }

  contentType(matcher: Predicate<Nullable<string>> | Matcher<Nullable<string>> | string): this {
    notNull(matcher)

    const target = makeTarget('header', 'content-type')

    if (typeof matcher === 'string') {
      this._mock.matchers.push(
        this.spec(target, selector.header(H.ContentType), equalTo(matcher, true), score.VeryLow),
      )
    } else {
      this._mock.matchers.push(
        this.spec(target, selector.header(H.ContentType), fromPredicate(matcher), score.VeryLow),
      )
    }

    return this
  }

  basicAuth(username: string | Matcher<string>, password: string = ''): this {
    notNull(username)
    notNull(password)

    const encoded = base64.encode(`${username}:${password}`)

    this._mock.matchers.push(
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

    this._mock.matchers.push(
      this.spec(
        makeTarget('bearer_token', token),
        selector.request,
        bearerToken(token),
        score.VeryLow,
      ),
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
      this._mock.matchers.push(
        this.spec(target, selector.query(key), equalTo(matcher), score.VeryLow),
      )
    } else {
      this._mock.matchers.push(
        this.spec(target, selector.query(key), fromPredicate(matcher), score.VeryLow),
      )
    }

    return this
  }

  queries(key: string, matcher: Predicate<Array<string>> | Matcher<Array<string>> | string): this {
    notBlank(key)
    notNull(matcher)

    const target = makeTarget('query', key)

    if (typeof matcher === 'string') {
      this._mock.matchers.push(
        this.spec(target, selector.queries(key), equalTo(matcher), score.VeryLow),
      )
    } else {
      this._mock.matchers.push(
        this.spec(target, selector.queries(key), fromPredicate(matcher), score.VeryLow),
      )
    }

    return this
  }

  querystring(matcher: Matcher<URLSearchParams>): this {
    notNull(matcher)

    this._mock.matchers.push(this.spec('querystring', selector.fullQuerystring, matcher, score.Low))

    return this
  }

  requestBody(...matchers: Array<Matcher<BodyType>>): this {
    notEmpty(matchers)
    noNullElements(matchers)

    if (matchers.length === 0) {
      this._mock.matchers.push(this.spec('body', selector.body, matchers[0], score.Medium))
    } else {
      this._mock.matchers.push(this.spec('body', selector.body, allOf(...matchers), score.Medium))
    }

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
      this._mock.matchers.push(
        this.spec('files', selector.files, fromPredicate(matchers[0]), score.Low),
      )
    }

    this._mock.matchers.push(
      this.spec(
        'files',
        selector.files,
        allOf(...matchers.map(x => fromPredicate(x))),
        score.Medium,
      ),
    )

    return this
  }

  file(field: string, ...matchers: Array<Matcher<Express.Multer.File | undefined>>): this {
    notBlank(field)
    notEmpty(matchers)
    noNullElements(matchers)

    const target = makeTarget('file', field)

    if (matchers.length === 0) {
      this._mock.matchers.push(
        this.spec(target, selector.fileByFieldName(field), matchers[0], score.Low),
      )
    }

    this._mock.matchers.push(
      this.spec(target, selector.fileByFieldName(field), allOf(...matchers), score.Medium),
    )

    return this
  }

  cookie(
    name: string,
    matcher: Predicate<Nullable<string>> | Matcher<Nullable<string>> | string,
  ): this {
    const target = makeTarget('cookie', name)

    if (typeof matcher === 'string') {
      this._mock.matchers.push(
        this.spec(target, selector.cookie(name), equalTo(matcher), score.VeryLow),
      )
    } else {
      this._mock.matchers.push(
        this.spec(target, selector.cookie(name), fromPredicate(matcher), score.VeryLow),
      )
    }

    return this
  }

  cookieJson(
    name: string,
    matcher: Predicate<Nullable<JsonType>> | Matcher<Nullable<JsonType>>,
  ): this {
    this._mock.matchers.push(
      this.spec(
        makeTarget('cookieJSON', name),
        selector.jsonCookie(name),
        fromPredicate(matcher),
        score.VeryLow,
      ),
    )

    return this
  }

  repeat(times: number): this {
    notNull(times)

    this._mock.matchers.push(
      this.spec(makeTarget('request', times), selector.nothing, repeat(times), score.None),
    )

    return this
  }

  expect(...matchers: Array<Predicate<SrvRequest> | Matcher<SrvRequest>>): this {
    notEmpty(matchers)
    noNullElements(matchers)

    this._mock.matchers.push(
      this.spec(
        'request',
        selector.request,
        allOf(...matchers.map(x => fromPredicate(x))),
        score.Low,
      ),
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
  reply(reply: HttpReply | ReplyFn | number, body?: BodyType): this {
    if (typeof reply === 'number') {
      this._mock.reply = newReply().status(reply).body(body)
    } else {
      this._mock.reply = wrapReply(reply)
    }

    return this
  }

  build(deps: Deps): HttpMock {
    this.validate()

    if (this._scenario) {
      this._mock.matchers.push(
        this.spec(
          makeTarget('state', this._scenario),
          selector.nothing,
          stateMatcher(deps.stateRepository)(
            this._scenario,
            this._scenarioRequiredState,
            this._scenarioNewState,
          ),
          score.High,
        ),
      )
    }

    return this._mock
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
    notEmpty(this._mock.matchers, 'Mocks needs to have at least one Matcher.')
    noNullElements(
      this._mock.matchers,
      'Matchers list must not contain null or undefined elements.',
    )
    notNull(this._mock.reply, 'Response definition is required. Call .reply() to create one.')
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
