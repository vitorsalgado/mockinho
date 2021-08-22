import { Expectation } from '@mockinho/core'
import { HttpRequest } from '../HttpRequest'
import { RecordOptions } from './RecordOptions'

export class RecordOptionsBuilder {
  private _destination: string = ''
  private _captureRequestHeaders: Array<string> = []
  private _captureResponseHeaders: Array<string> = []
  private _filters: Array<Expectation<unknown, HttpRequest>> = []

  destination(dest: string): this {
    this._destination = dest
    return this
  }

  captureRequestHeaders(...header: Array<string>): this {
    this._captureRequestHeaders.push(...header.map(x => x.toLowerCase()))
    return this
  }

  captureResponseHeaders(...header: Array<string>): this {
    this._captureResponseHeaders.push(...header.map(x => x.toLowerCase()))
    return this
  }

  build(): RecordOptions {
    return {
      destination: this._destination,
      captureRequestHeaders: this._captureRequestHeaders,
      captureResponseHeaders: this._captureResponseHeaders,
      filters: this._filters
    }
  }
}
