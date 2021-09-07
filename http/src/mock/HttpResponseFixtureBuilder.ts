import Path from 'path'
import * as Fs from 'fs'
import * as Util from 'util'
import { CookieOptions } from 'express'
import { isTrue, notBlank, notNull } from '@mockinho/core'
import { BodyType } from '../types'
import { DefaultResponseBuilder } from '../types'
import { HttpRequest } from '../HttpRequest'
import { HttpContext } from '../HttpContext'
import { MediaTypes } from '../MediaTypes'
import { Headers } from '../Headers'
import { StatusCodes } from '../StatusCodes'
import { HttpResponseFixture } from './HttpResponseFixture'
import { Cookie } from './Cookie'
import { ClearCookie } from './Cookie'
import { InvalidResponseFixtureError } from './errors'
import { HttpMock } from './HttpMock'

const access = Util.promisify(Fs.access)

export type HttpResponseFixtureBuilderFunction = (
  context: HttpContext,
  request: HttpRequest,
  mock: HttpMock
) => Promise<HttpResponseFixture>

export class HttpResponseFixtureBuilder {
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
  protected _proxyFrom: string = ''
  protected _proxyHeaders: Record<string, string> = {}

  static newBuilder = (): DefaultResponseBuilder =>
    new HttpResponseFixtureBuilder() as DefaultResponseBuilder

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

  proxyFrom(target: string): this {
    notBlank(target)

    this._proxyFrom = target

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

    return this.body(JSON.stringify(body)).header(Headers.ContentType, MediaTypes.APPLICATION_JSON)
  }

  bodyFile(path: string): this {
    notBlank(path)

    this._bodyFile = path
    this._bodyFileRelativeToFixtures = !Path.isAbsolute(path)
    this._bodyCtrl++

    return this
  }

  bodyWith(builder: (request: HttpRequest) => BodyType | Promise<BodyType>): this {
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

  latency(ms: number): this {
    notNull(ms)

    this._delay = ms

    return this
  }

  // endregion

  build(): HttpResponseFixtureBuilderFunction {
    return async (
      context: HttpContext,
      request: HttpRequest,
      _mock: HttpMock
    ): Promise<HttpResponseFixture> => {
      notNull(context)
      notNull(this._status)
      isTrue(this._delay >= 0, 'Delay must be a positive number.')

      if (this._bodyCtrl > 1) {
        throw new InvalidResponseFixtureError(
          'Found more than one body strategy setup. Choose between: .body(), .bodyJSON(), .bodyFile() or .bodyWith()'
        )
      }

      if (this._bodyFile) {
        const file = this._bodyFileRelativeToFixtures
          ? await HttpResponseFixtureBuilder.makeValidPath(
              context.configuration.mockDirectory,
              this._bodyFile
            )
          : this._bodyFile

        this._body = Fs.createReadStream(Path.resolve(file), 'utf8')
      } else if (this._bodyFunction) {
        const body = this._bodyFunction(request)

        if (body instanceof Promise) {
          this._body = await body
        } else {
          this._body = this._bodyFunction(request)
        }
      }

      return new HttpResponseFixture(
        this._status,
        this._headers,
        this._body,
        this._cookies,
        this._cookiesToClear,
        this._delay,
        this._proxyFrom,
        this._proxyHeaders
      )
    }
  }

  // region Util

  private static makeValidPath(...path: Array<string>): Promise<string> {
    const file = Path.join(...path)

    return access(file)
      .then(() => file)
      .catch(() => {
        throw new TypeError(`File ${file} not found!`)
      })
  }

  // endregion
}
