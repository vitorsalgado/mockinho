import { Metadata } from '@grpc/grpc-js'
import { MetadataValue } from '@grpc/grpc-js'
import { notBlank } from '@mockdog/core'
import { notNull } from '@mockdog/core'
import { ResponseBuilderDelegate } from './ResponseBuilderDelegate.js'
import { Response } from './Response.js'

export abstract class ResponseBuilder<REQUEST, RESPONSE extends Response> {
  protected _metadata: Metadata = new Metadata()
  protected _flags?: number

  metadata(key: string, value: MetadataValue): this {
    notBlank(key)

    this._metadata.add(key, value)

    return this
  }

  flags(flags: number): this {
    notNull(flags)

    this._flags = flags

    return this
  }

  abstract build(): ResponseBuilderDelegate<REQUEST, RESPONSE>
}
