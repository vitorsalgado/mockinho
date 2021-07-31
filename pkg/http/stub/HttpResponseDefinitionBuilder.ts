import Path from 'path'
import { isTrue } from '../../../internal/preconditions/isTrue'
import { notBlank } from '../../../internal/preconditions/notBlank'
import { notNull } from '../../../internal/preconditions/notNull'
import {
  ResponseDefinitionBuilder,
  ResponseDefinitionBuilderContext
} from '../../../internal/StubTypes'
import { convertBodyToJSON } from '../../../internal/utils/convertBodyToJSON'
import { fromFile } from '../../shared/bodyconverters'
import { BodyType, Headers, MediaTypes, StatusCodes } from '../types'
import { HttpResponseDefinition } from './HttpResponseDefinition'

export class HttpResponseDefinitionBuilder
  implements ResponseDefinitionBuilder<HttpResponseDefinition>
{
  private _status: number = StatusCodes.OK
  private _body: BodyType = undefined
  private _bodyFile: string = ''
  private _bodyFileRelativeToFixtures: boolean = true
  private _headers: Record<string, string> = {}
  private _delay: number = 0

  static newBuilder = (): HttpResponseDefinitionBuilder => new HttpResponseDefinitionBuilder()

  // region Builder

  status(status: number): HttpResponseDefinitionBuilder {
    notNull(status)

    this._status = status

    return this
  }

  header(key: string, value: string): HttpResponseDefinitionBuilder {
    notBlank(key)
    notNull(value)

    this._headers[key] = value

    return this
  }

  headerLocation(location?: string): HttpResponseDefinitionBuilder {
    if (location === null || typeof location === 'undefined') {
      return this
    }

    this._headers[Headers.Location] = location

    return this
  }

  headers(headers: Record<string, string>): HttpResponseDefinitionBuilder {
    notNull(headers)

    for (const [key, value] of Object.entries(headers)) {
      this._headers[key] = value
    }

    return this
  }

  body(body: BodyType): HttpResponseDefinitionBuilder {
    this._body = body

    return this
  }

  bodyJSON(body: BodyType | Record<string, unknown>): HttpResponseDefinitionBuilder {
    return this.body(convertBodyToJSON(body)).header(
      Headers.ContentType,
      MediaTypes.APPLICATION_JSON
    )
  }

  bodyFile(path: string, relativeToFixtures: boolean = true): HttpResponseDefinitionBuilder {
    notBlank(path)

    this._bodyFile = path
    this._bodyFileRelativeToFixtures = relativeToFixtures

    return this
  }

  delayInMs(ms: number): HttpResponseDefinitionBuilder {
    notNull(ms)

    this._delay = ms
    return this
  }

  // endregion

  build(context: ResponseDefinitionBuilderContext): HttpResponseDefinition {
    notNull(context)

    this.validate()

    if (this._bodyFile) {
      const file = this._bodyFileRelativeToFixtures
        ? Path.join(context.fixturesBodyPath, this._bodyFile)
        : this._bodyFile

      this._body = fromFile(file)
    }

    return new HttpResponseDefinition(this._status, this._headers, this._body, this._delay)
  }

  validate(): void {
    notNull(this._status)
    isTrue(this._delay >= 0, 'Delay must be a positive number.')
  }
}
