import { HttpStub } from '../stub'
import { HttpMethods } from '../types'

export interface HttpEvents {
  requestReceived: {
    readonly verbose: boolean
    readonly method: HttpMethods
    readonly url: string
    readonly href: string
    readonly headers: Record<string, string>
    readonly body: unknown
  }

  requestNotMatched: {
    readonly method: HttpMethods
    readonly url: string
    readonly closestMatch?: HttpStub
  }

  requestMatched: {
    readonly verbose: boolean
    readonly method: HttpMethods
    readonly url: string
    readonly responseDefinition: {
      readonly status: number
      readonly headers: Record<string, string>
      readonly body: unknown
    }
    readonly stub: {
      id: string
      name: string
      sourceDescription: string
    }
  }
}
