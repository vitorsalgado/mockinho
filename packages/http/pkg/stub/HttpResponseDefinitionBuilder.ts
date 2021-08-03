import Path from 'path'
import Fs from 'fs'
import { isTrue, notBlank, notNull, ResponseDefinitionBuilder, MockinhoError } from '@mockinho/core'

import { fromFile, toJSON } from '@mockinho/core-bodyconverters'
import { BodyType, Headers, MediaTypes, StatusCodes, ErrorCodes } from '../types'
import { HttpRequest } from '../HttpRequest'
import { HttpContext } from '../HttpContext'
import { Configurations } from '../config'
import { HttpServerFactory } from '../HttpServer'
import { HttpResponseDefinition } from './HttpResponseDefinition'

class InvalidResponseDefinitionError extends MockinhoError {
  constructor(message: string) {
    super(message, ErrorCodes.MR_ERR_INVALID_RESPONSE_DEFINITION)
  }
}

export class HttpResponseDefinitionBuilder<
  SF extends HttpServerFactory,
  C extends Configurations<SF>
> implements ResponseDefinitionBuilder<HttpContext<SF, C>, HttpRequest, HttpResponseDefinition>
{
  private _status: number = StatusCodes.OK
  private _body: BodyType = undefined
  private _bodyFile: string = ''
  private _bodyFunction?: (request: HttpRequest) => BodyType
  private _bodyFileRelativeToFixtures: boolean = true
  private _bodyCtrl: number = 0
  private _headers: Record<string, string> = {}
  private _delay: number = 0

  static newBuilder = <
    SF extends HttpServerFactory,
    C extends Configurations<SF>
  >(): HttpResponseDefinitionBuilder<SF, C> => new HttpResponseDefinitionBuilder()

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

  delayInMs(ms: number): this {
    notNull(ms)

    this._delay = ms

    return this
  }

  // endregion

  build(context: HttpContext<SF, C>, request: HttpRequest): HttpResponseDefinition {
    notNull(context)

    if (this._bodyFile) {
      const file = this._bodyFileRelativeToFixtures
        ? Path.join(context.provideConfigurations().stubsBodyContentDirectory, this._bodyFile)
        : this._bodyFile

      this._body = fromFile(file)
    } else if (this._bodyFunction) {
      this._body = this._bodyFunction(request)
    }

    return new HttpResponseDefinition(this._status, this._headers, this._body, this._delay)
  }

  validate(context: HttpContext<SF, C>): void {
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
