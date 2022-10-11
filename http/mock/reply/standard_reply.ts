import Path from 'path'
import * as Fs from 'fs'
import * as Util from 'node:util'
import { CookieOptions, Response } from 'express'
import { isTrue, JsonType, notBlank, notEmpty, notNull } from '@mockdog/x'
import { HandlebarsTemplating, Helper, Template, TemplateDelegate } from '@mockdog/core'
import { HeaderList } from '../../headers.js'
import { BodyType, H, MediaTypes, SC } from '../../http.js'
import { SrvRequest } from '../../request.js'
import { TemplateModel, TmplRequest } from './template.js'
import { Cookie, CookieToClear, Reply, ReplyCtx, SrvResponse } from './reply.js'

const access = Util.promisify(Fs.access)
const readFile = Util.promisify(Fs.readFile)

export class StandardReply implements Reply {
  protected _status: number = SC.OK
  protected _body: BodyType = undefined
  protected _bodyFile: string = ''
  protected _bodyFunction?: (request: SrvRequest) => BodyType
  protected _bodyFileRelativeToFixtures: boolean = true
  protected _bodyTemplate?: TemplateDelegate<TemplateModel>
  protected _bodyTemplatePath?: string
  protected _templateHelpers?: Helper

  protected _templating: Template<TemplateModel> = new HandlebarsTemplating()

  protected _bodyCtrl: number = 0
  protected _headers = new HeaderList()
  protected _headersWithTemplateValue: Record<string, TemplateDelegate<TemplateModel>> = {}

  protected _cookies: Array<Cookie> = []
  protected _cookiesToClear: Array<CookieToClear> = []
  protected _delay: number = 0
  protected _model?: JsonType

  static newBuilder = (): StandardReply => new StandardReply()

  // region Builder

  status(status: number): this {
    notNull(status)

    this._status = status

    return this
  }

  header(key: string, value: string): this {
    notBlank(key)
    notNull(value)

    this._headers.append(key, value)

    return this
  }

  headerTemplate(key: string, templateValue: string): this {
    notBlank(key)
    notNull(templateValue)

    this._headersWithTemplateValue[key] = this._templating.compile(templateValue)

    return this
  }

  headerLocation(location: string = ''): this {
    this._headers.set(H.Location, location)

    return this
  }

  headers(headers: Record<string, string>): this {
    notNull(headers)

    for (const [key, value] of Object.entries(headers)) {
      this._headers.append(key, value)
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

    return this.body(JSON.stringify(body)).header(H.ContentType, MediaTypes.APPLICATION_JSON)
  }

  bodyFile(path: string): this {
    notBlank(path)

    this._bodyFile = path
    this._bodyFileRelativeToFixtures = !Path.isAbsolute(path)
    this._bodyCtrl++

    return this
  }

  bodyWith(builder: (request: SrvRequest) => BodyType | Promise<BodyType>): this {
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

  helpers(helpers: Helper): this {
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

  delay(ms: number): this {
    notNull(ms)

    this._delay = ms

    return this
  }

  // endregion

  async build(request: SrvRequest, res: Response, ctx: ReplyCtx): Promise<SrvResponse> {
    notNull(request)
    notNull(this._status)
    isTrue(this._delay >= 0, 'Delay must be a positive number.')

    if (this._bodyFile) {
      const file = this._bodyFileRelativeToFixtures
        ? await StandardReply.makeValidPath(ctx.config.mockDirectory, this._bodyFile)
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
        { request: StandardReply.toRequestTmpl(request), model: this._model },
        { ...this._templateHelpers },
      )
    } else if (this._bodyTemplatePath) {
      const file = this._bodyFileRelativeToFixtures
        ? await StandardReply.makeValidPath(ctx.config.mockDirectory, this._bodyTemplatePath)
        : this._bodyTemplatePath

      const buf = await readFile(file)
      const content = buf.toString()

      this._body = await this._templating.compile(content)(
        { request: StandardReply.toRequestTmpl(request), model: this._model },
        { ...this._templateHelpers },
      )
    }

    for (const [key, template] of Object.entries(this._headersWithTemplateValue)) {
      this.header(
        key,
        await template(
          {
            request: StandardReply.toRequestTmpl(request),
            model: this._model,
          },
          { ...this._templateHelpers },
        ),
      )
    }

    return new SrvResponse(
      this._status,
      this._headers,
      this._body,
      this._cookies,
      this._cookiesToClear,
      this._delay,
    )
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

  private static toRequestTmpl(r: SrvRequest): TmplRequest {
    return {
      id: r.$internals.id,
      href: r.$internals.href,
      url: r.url,
      method: r.method,
      headers: r.headers,
      query: r.query,
      body: r.body,
      isMultipart: r.$internals.isMultipart,
      start: r.$internals.start,
    }
  }

  // endregion
}
