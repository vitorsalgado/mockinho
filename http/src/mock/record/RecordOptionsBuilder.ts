import Path from 'path'
import { RecordOptions } from './RecordOptions'

export class RecordOptionsBuilder {
  private _destination: string = ''
  private _captureRequestHeaders?: Array<string>
  private _captureResponseHeaders?: Array<string>

  destination(dest: string): this {
    this._destination = Path.resolve(dest)
    return this
  }

  captureRequestHeaders(header: Array<string>): this {
    this._captureRequestHeaders = header.map(x => x.toLowerCase())
    return this
  }

  captureResponseHeaders(header: Array<string>): this {
    this._captureResponseHeaders = header.map(x => x.toLowerCase())
    return this
  }

  build(): RecordOptions {
    return {
      destination: this._destination,
      captureRequestHeaders: this._captureRequestHeaders,
      captureResponseHeaders: this._captureResponseHeaders
    }
  }
}
