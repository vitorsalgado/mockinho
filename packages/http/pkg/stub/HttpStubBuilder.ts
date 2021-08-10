/* eslint-disable no-console */

import { Express } from 'express'
import Chalk from 'chalk'
import { allOf, equalsTo, hitTimes } from '@mockinho/core-matchers'
import { anyItem } from '@mockinho/core-matchers'
import { notMatched } from '@mockinho/core-matchers'
import { encodeBase64 } from '@mockinho/core'
import { Matcher } from '@mockinho/core'
import { notNull } from '@mockinho/core'
import { noNullElements } from '@mockinho/core'
import { StubSource } from '@mockinho/core'
import { notBlank } from '@mockinho/core'
import { notEmpty } from '@mockinho/core'
import { StubBaseBuilder } from '@mockinho/core'
import { Expectation } from '@mockinho/core'
import { MockinhoError } from '@mockinho/core'
import { DecoratedStubBuilder } from '../types'
import { BodyType, Headers } from '../types'
import { Schemes } from '../types'
import { HttpMethods } from '../types'
import { ErrorCodes } from '../types'
import { HttpRequest } from '../HttpRequest'
import { HttpContext } from '../HttpContext'
import { bearerToken, urlPath } from '../matchers'
import { HttpStub } from './HttpStub'
import { HttpResponseDefinitionBuilder } from './HttpResponseDefinitionBuilder'
import { HttpResponseDefinition } from './HttpResponseDefinition'

export class HttpStubBuilder extends StubBaseBuilder<
  HttpContext,
  HttpRequest,
  HttpResponseDefinition,
  HttpResponseDefinitionBuilder,
  HttpStub
> {
  private readonly _meta: Map<string, unknown> = new Map<string, unknown>()
  private _inspect: boolean = false

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

      this._meta.set('url', matcher)
      this._matchers.push(this.addSpec(extractUrl, urlPath(matcher), 10, 'Url'))
    } else {
      this._matchers.push(this.addSpec(extractUrl, matcher, 10, 'Url'))
    }

    return this
  }

  method(matcher: Matcher<string> | string | Array<string>): this {
    notNull(matcher)

    if (typeof matcher === 'string') {
      notBlank(matcher)

      this._meta.set('method', matcher)
      this._matchers.push(this.addSpec(extractMethod, equalsTo(matcher), 3, 'Method'))
    } else if (Array.isArray(matcher)) {
      notEmpty(matcher)
      noNullElements(matcher)

      this._meta.set('method', matcher.join(','))
      this._matchers.push(this.addSpec(extractMethod, anyItem(matcher), 3, 'Method'))
    } else {
      this._matchers.push(this.addSpec(extractMethod, matcher, 3, 'Method'))
    }

    return this
  }

  scheme(scheme: Schemes): this {
    this._matchers.push(this.addSpec(extractScheme, equalsTo(scheme), 1, 'Scheme'))

    return this
  }

  header(key: string, matcher: Matcher<string> | string): this {
    notBlank(key)
    notNull(matcher)

    if (typeof matcher === 'string') {
      this._matchers.push(
        this.addSpec(extractHeader(key.toLowerCase()), equalsTo(matcher), 0.5, 'Header')
      )
    } else {
      this._matchers.push(this.addSpec(extractHeader(key.toLowerCase()), matcher, 0.5, 'Header'))
    }

    return this
  }

  headers(matcher: Matcher<Record<string, string>>): this {
    notNull(matcher)

    this._matchers.push(this.addSpec(extractHeaders, matcher, 3, 'Header'))

    return this
  }

  contentType(matcher: Matcher<string> | string): this {
    notNull(matcher)

    if (typeof matcher === 'string') {
      this._matchers.push(
        this.addSpec(extractHeader(Headers.ContentType), equalsTo(matcher), 0.5, 'Header')
      )
    } else {
      this._matchers.push(this.addSpec(extractHeader(Headers.ContentType), matcher, 0.5, 'Header'))
    }

    return this
  }

  basicAuthorization(username: string, password: string): this {
    notNull(username)
    notNull(password)

    this._matchers.push(
      this.addSpec(
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

    this._matchers.push(this.addSpec(extractRequest, bearerToken(token), 0.5, 'Header'))

    return this
  }

  query(key: string, matcher: Matcher<string | string[] | undefined> | string): this {
    notBlank(key)
    notNull(matcher)

    if (typeof matcher === 'string') {
      this._matchers.push(
        this.addSpec(
          extractQuery(key),
          equalsTo<string | string[] | undefined>(matcher),
          0.5,
          'Query'
        )
      )
    } else {
      this._matchers.push(this.addSpec(extractQuery(key), matcher, 0.5, 'Query'))
    }

    return this
  }

  queries(matcher: Matcher<Record<string, string | string[] | undefined>>): this {
    notNull(matcher)

    this._matchers.push(this.addSpec(extractQueries, matcher, 3, 'Query'))

    return this
  }

  requestBody(...matchers: Array<Matcher<BodyType>>): this {
    notEmpty(matchers)
    noNullElements(matchers)

    if (matchers.length === 0) {
      this._matchers.push(this.addSpec(extractBody, matchers[0], 5, 'Body'))
    }

    this._matchers.push(this.addSpec(extractBody, allOf(...matchers), 5, 'Body'))

    return this
  }

  requestFields(...matchers: Array<Matcher<BodyType>>): this {
    return this.requestBody(...matchers)
  }

  files(...matchers: Array<Matcher<Array<Express.Multer.File>>>): this {
    notEmpty(matchers)
    noNullElements(matchers)

    if (matchers.length === 0) {
      this._matchers.push(this.addSpec(extractMultiPartFiles, matchers[0], 3, 'Files'))
    }

    this._matchers.push(this.addSpec(extractMultiPartFiles, allOf(...matchers), 5, 'Files'))

    return this
  }

  file(fieldName: string, ...matchers: Array<Matcher<Express.Multer.File | undefined>>): this {
    notBlank(fieldName)
    notEmpty(matchers)
    noNullElements(matchers)

    if (matchers.length === 0) {
      this._matchers.push(this.addSpec(extractFileByFieldName(fieldName), matchers[0], 3, 'Files'))
    }

    this._matchers.push(
      this.addSpec(extractFileByFieldName(fieldName), allOf(...matchers), 5, 'Files')
    )

    return this
  }

  cookie(key: string, matcher: Matcher<string> | string): this {
    if (typeof matcher === 'string') {
      this._matchers.push(
        this.addSpec(extractCookie(key), equalsTo<string | undefined>(matcher), 0.5, 'Cookies')
      )
    } else {
      this._matchers.push(this.addSpec(extractCookie(key) as any, matcher, 0.5, 'Cookies'))
    }

    return this
  }

  cookieJson(key: string, matcher: Matcher<Record<string, unknown>> | string): this {
    if (typeof matcher === 'string') {
      this._matchers.push(
        this.addSpec(
          extractCookieAsJson(key),
          equalsTo<string | undefined>(matcher),
          0.5,
          'Cookies'
        )
      )
    } else {
      this._matchers.push(this.addSpec(extractCookieAsJson(key) as any, matcher, 0.5, 'Cookies'))
    }

    return this
  }

  hitTimes(times: number): this {
    notNull(times)

    this._matchers.push(this.addSpec(extractNothing, hitTimes(times), 0, 'Times'))

    return this
  }

  expect(...matchers: Array<Matcher<HttpRequest>>): this {
    notEmpty(matchers)
    noNullElements(matchers)

    if (matchers.length === 1) {
      this._matchers.push(this.addSpec(extractRequest, matchers[0], 1, 'Request'))
    }

    this._matchers.push(this.addSpec(extractRequest, allOf(...matchers), 1, 'Request'))

    return this
  }

  proxyTo(target: string, response: HttpResponseDefinitionBuilder): this {
    response.proxyFrom(target)

    this._responseDefinitionBuilder = response

    return this
  }

  inspect(mode: boolean = true): this {
    this._inspect = mode

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
    notEmpty(this._matchers, 'Stubs needs to have at least one Matcher.')
    noNullElements(this._matchers, 'Matchers list must not contain null or undefined elements.')
    notNull(
      this._responseDefinitionBuilder,
      'Response definition is required. Call .reply() to create one.'
    )
  }

  protected addSpec<T>(
    valueGetter: (request: HttpRequest) => T,
    matcher: Matcher<T>,
    weight: number = 0,
    container: string
  ): Expectation<T, HttpRequest> {
    return {
      matcher: this._inspect
        ? notMatched(matcher, (matcher, value, ctx) => {
            console.log(Chalk.redBright.bold(`${container}: "${matcher.name}" did not match.`))
            console.log(
              Chalk.redBright(
                `Stub: ${
                  ctx?.stub.sourceDescription
                    ? `${ctx?.stub.sourceDescription}`
                    : ctx?.stub.name
                    ? ctx.stub.name
                    : ctx?.stub.id
                }`
              )
            )
            console.log(Chalk.redBright(`Received: ${JSON.stringify(value)}`))
          })
        : matcher,
      valueGetter,
      weight
    }
  }
}

const extractRequest = (request: HttpRequest): HttpRequest => request
const extractScheme = (request: HttpRequest): Schemes => request.protocol as Schemes
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
const extractCookie =
  (key: string) =>
  (request: HttpRequest): string | undefined => {
    if (request.cookies && request.cookies[key]) {
      return request.cookies[key]
    } else if (request.signedCookies && request.signedCookies[key]) {
      return request.signedCookies[key]
    }

    return undefined
  }
const extractCookieAsJson =
  (key: string) =>
  (request: HttpRequest): string | undefined => {
    if (request.cookies && request.cookies[key]) {
      return JSON.parse(request.cookies[key])
    } else if (request.signedCookies && request.signedCookies[key]) {
      return JSON.parse(request.signedCookies[key])
    }

    return undefined
  }

export class InvalidStubConfigurationError extends MockinhoError {
  constructor(message: string) {
    super(message, ErrorCodes.MR_ERR_INVALID_STUB_CONFIG)
  }
}
