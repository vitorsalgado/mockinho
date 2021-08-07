import { notBlank } from '@mockinho/core'
import { notNull } from '@mockinho/core'
import { HttpResponseDefinitionBuilder } from './HttpResponseDefinitionBuilder'

export class HttpResponseProxyDefinitionBuilder extends HttpResponseDefinitionBuilder {
  constructor(target: string) {
    notBlank(target)

    super()

    this._proxyFrom = target
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
}
