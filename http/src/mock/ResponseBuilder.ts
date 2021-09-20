import Path from 'path'
import * as Fs from 'fs'
import * as Util from 'util'
import { CookieOptions } from 'express'
import { isTrue, notBlank, notNull } from '@mockdog/core'
import { JsonType } from '@mockdog/core'
import { notEmpty } from '@mockdog/core'
import { HttpRequest } from '../HttpRequest'
import { HttpContext } from '../HttpContext'
import { MediaTypes } from '../MediaTypes'
import { Headers } from '../Headers'
import { StatusCodes } from '../StatusCodes'
import { BodyType } from '../BodyType'
import { ResponseFixture } from './ResponseFixture'
import { Cookie } from './Cookie'
import { CookieToClear } from './Cookie'
import { HttpMock } from './HttpMock'
import { ResponseDelegate } from './ResponseDelegate'
import { Templating } from './templating'
import { CustomHelper } from './templating'
import { HandlebarsTemplating } from './templating'
import { Delegate } from './templating'
import { TemplatingBuiltInHelpers } from './templating'

const access = Util.promisify(Fs.access)
const readFile = Util.promisify(Fs.readFile)

export class ResponseBuilder {
  protected _status: number = StatusCodes.OK
  protected _body: BodyType = undefined
  protected _bodyFile: string = ''
  protected _bodyFunction?: (request: HttpRequest) => BodyType
  protected _bodyFileRelativeToFixtures: boolean = true
  protected _bodyTemplate?: Delegate
  protected _bodyTemplatePath?: string
  protected _templateHelpers?: CustomHelper
  protected _templating: Templating = new HandlebarsTemplating()
  protected _bodyCtrl: number = 0
  protected _headers: Record<string, string> = {}
  protected _headersWithTemplateValue: Record<string, Delegate> = {}
  protected _cookies: Array<Cookie> = []
  protected _cookiesToClear: Array<CookieToClear> = []
  protected _delay: number = 0
  protected _proxyFrom: string = ''
  protected _proxyHeaders: Record<string, string> = {}
  protected _model?: JsonType

  static newBuilder = (): ResponseBuilder => new ResponseBuilder()

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

  headerTemplate(key: string, templateValue: string): this {
    notBlank(key)
    notNull(templateValue)

    this._headersWithTemplateValue[key] = this._templating.compile(templateValue)

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

  bodyJSON(body: JsonType): this {
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

  bodyTemplate(template: string | JsonType): this {
    notNull(template)

    this._bodyCtrl++

    let input: string

    if (typeof template === 'string') {
      input = template
    } else if (typeof template === 'object') {
      input = JSON.stringify(template)
    } else {
      throw new Error('Invalid template type. Template must be a string, object or array.')
    }

    this._bodyTemplate = this._templating.compile(input)

    return this
  }

  bodyTemplatePath(path: string): this {
    notNull(path)
    notEmpty(path)

    this._bodyTemplatePath = path
    this._bodyFileRelativeToFixtures = !Path.isAbsolute(path)
    this._bodyCtrl++

    return this
  }

  model(model: JsonType): this {
    notNull(model)

    this._model = model

    return this
  }

  helpers(helpers: CustomHelper): this {
    notNull(helpers)

    this._templateHelpers = helpers

    return this
  }

  cookie(key: string, value: string, options?: CookieOptions): this {
    this._cookies.push({ key, value, options })
    return this
  }

  cookieJson(key: string, value: JsonType, options?: CookieOptions): this {
    this.cookie(key, JSON.stringify(value), options)

    return this
  }

  clearCookie(key: string, options?: CookieOptions): this {
    return this.clearCookies({ key, options })
  }

  clearCookies(...cookies: Array<CookieToClear>): this {
    this._cookiesToClear.push(...cookies)

    return this
  }

  latency(ms: number): this {
    notNull(ms)

    this._delay = ms

    return this
  }

  // endregion

  build(): ResponseDelegate {
    if (this._bodyCtrl > 1) {
      throw new Error(
        'Found more than one body strategy setup. Choose between: .body(), .bodyJSON(), .bodyFile(), .bodyWith() or .bodyTemplate()'
      )
    }

    return async (
      context: HttpContext,
      request: HttpRequest,
      _mock: HttpMock
    ): Promise<ResponseFixture> => {
      notNull(context)
      notNull(this._status)
      isTrue(this._delay >= 0, 'Delay must be a positive number.')

      if (this._bodyFile) {
        const file = this._bodyFileRelativeToFixtures
          ? await ResponseBuilder.makeValidPath(context.configuration.mockDirectory, this._bodyFile)
          : this._bodyFile

        this._body = Fs.createReadStream(Path.resolve(file), 'utf8')
      } else if (this._bodyFunction) {
        const body = this._bodyFunction(request)

        if (body instanceof Promise) {
          this._body = await body
        } else {
          this._body = this._bodyFunction(request)
        }
      } else if (this._bodyTemplate) {
        this._body = await this._bodyTemplate(
          { request, model: this._model, env: process.env },
          { ...TemplatingBuiltInHelpers, ...this._templateHelpers }
        )
      } else if (this._bodyTemplatePath) {
        const file = this._bodyFileRelativeToFixtures
          ? await ResponseBuilder.makeValidPath(
              context.configuration.mockDirectory,
              this._bodyTemplatePath
            )
          : this._bodyTemplatePath

        const buf = await readFile(file)
        const content = buf.toString()

        this._body = await this._templating.compile(content)(
          { request, model: this._model, env: process.env },
          { ...TemplatingBuiltInHelpers, ...this._templateHelpers }
        )
      }

      for (const [key, template] of Object.entries(this._headersWithTemplateValue)) {
        this.header(
          key,
          await template(
            {
              request,
              model: this._model,
              env: process.env
            },
            { ...TemplatingBuiltInHelpers, ...this._templateHelpers }
          )
        )
      }

      return new ResponseFixture(
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
