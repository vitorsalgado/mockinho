import Path from 'path'
import Fs from 'fs'
import { CookieOptions } from 'express'
import { isTrue, notBlank, notNull, ResponseDefinitionBuilder, MockinhoError } from '@mockinho/core'
import { fromFile, toJSON } from '@mockinho/core-bodyconverters'
import { BodyType, Headers, MediaTypes, StatusCodes, ErrorCodes } from '../types'
import { DecoratedResponseBuilder } from '../types'
import { HttpRequest } from '../HttpRequest'
import { HttpContext } from '../HttpContext'
import { Configurations } from '../config'
import { ExpressConfigurations } from '../config'
import { HttpResponseDefinition } from './HttpResponseDefinition'
import { Cookie } from './Cookie'
import { ClearCookie } from './Cookie'

class InvalidResponseDefinitionError extends MockinhoError {
  constructor(message: string) {
    super(message, ErrorCodes.MR_ERR_INVALID_RESPONSE_DEFINITION)
  }
}

export class HttpResponseDefinitionBuilder<C extends Configurations = ExpressConfigurations>
  implements ResponseDefinitionBuilder<HttpContext<C>, HttpRequest, HttpResponseDefinition>
{
  protected _status: number = StatusCodes.OK
  protected _body: BodyType = undefined
  protected _bodyFile: string = ''
  protected _bodyFunction?: (request: HttpRequest) => BodyType
  protected _bodyFileRelativeToFixtures: boolean = true
  protected _bodyCtrl: number = 0
  protected _headers: Record<string, string> = {}
  protected _cookies: Array<Cookie> = []
  protected _cookiesToClear: Array<ClearCookie> = []
  protected _delay: number = 0
  protected _proxyTo: string = ''
  protected _proxyHeaders: Record<string, string> = {}

  static newBuilder = (): DecoratedResponseBuilder =>
    new HttpResponseDefinitionBuilder() as DecoratedResponseBuilder

  // region Builder

  status(status: number): this {
    notNull(status)

    this._status = status

    return this
  }

  header(key: string, value: string): this {
    notBlank(key)
    notNull(value)

    this._headers[key] = value

    return this
  }

  headerLocation(location?: string): this {
    if (location === null || typeof location === 'undefined') {
      return this
    }

    this._headers[Headers.Location] = location

    return this
  }

  headers(headers: Record<string, string>): this {
    notNull(headers)

    for (const [key, value] of Object.entries(headers)) {
      this._headers[key] = value
    }

    return this
  }

  proxyTo(target: string): this {
    notBlank(target)

    this._proxyTo = target

    return this
  }

  proxyHeader(key: string, value: string): this {
    notBlank(key)
    notNull(value)

    this._proxyHeaders[key] = value

    return this
  }

  proxyHeaders(headers: Record<string, string>): this {
    notNull(headers)

    for (const [key, value] of Object.entries(headers)) {
      this._proxyHeaders[key] = value
    }

    return this
  }

  body(body: BodyType): this {
    this._body = body
    this._bodyCtrl++

    return this
  }

  bodyJSON(body: Record<string, unknown>): this {
    notNull(body)

    return this.body(toJSON(body)).header(Headers.ContentType, MediaTypes.APPLICATION_JSON)
  }

  bodyFile(path: string, relativeToFixtures: boolean = true): this {
    notBlank(path)

    this._bodyFile = path
    this._bodyFileRelativeToFixtures = relativeToFixtures
    this._bodyCtrl++

    return this
  }

  bodyWith(builder: (request: HttpRequest) => BodyType): this {
    this._bodyFunction = builder
    this._bodyCtrl++

    return this
  }

  cookie(key: string, value: string, options?: CookieOptions): this {
    this._cookies.push({ key, value, options })
    return this
  }

  cookieJson(
    key: string,
    value: Record<string, unknown> | Array<unknown>,
    options?: CookieOptions
  ): this {
    this.cookie(key, JSON.stringify(value), options)

    return this
  }

  clearCookie(key: string, options?: CookieOptions): this {
    return this.clearCookies({ key, options })
  }

  clearCookies(...cookies: Array<ClearCookie>): this {
    this._cookiesToClear.push(...cookies)

    return this
  }

  delayInMs(ms: number): this {
    notNull(ms)

    this._delay = ms

    return this
  }

  // endregion

  build(context: HttpContext<C>, request: HttpRequest): HttpResponseDefinition {
    notNull(context)

    if (this._bodyFile) {
      const file = this._bodyFileRelativeToFixtures
        ? Path.join(context.provideConfigurations().stubsBodyContentDirectory, this._bodyFile)
        : this._bodyFile

      this._body = fromFile(file)
    } else if (this._bodyFunction) {
      this._body = this._bodyFunction(request)
    }

    return new HttpResponseDefinition(
      this._status,
      this._headers,
      this._body,
      this._cookies,
      this._cookiesToClear,
      this._delay,
      this._proxyTo,
      this._proxyHeaders
    )
  }

  validate(context: HttpContext): void {
    notNull(this._status)
    isTrue(this._delay >= 0, 'Delay must be a positive number.')

    if (this._bodyCtrl > 1) {
      throw new InvalidResponseDefinitionError(
        'Found more than one body strategy setup. Choose between: .body() .bodyFile() or .bodyWith()'
      )
    }

    if (this._bodyFile) {
      const file = this._bodyFileRelativeToFixtures
        ? Path.join(context.provideConfigurations().stubsBodyContentDirectory, this._bodyFile)
        : this._bodyFile

      if (!Fs.existsSync(file)) {
        throw new TypeError(`File ${file} not found!`)
      }
    }
  }
}
