import { HttpMock } from '../mock'
import { HttpMethods } from '../types'
import { HttpServerInfo } from '../HttpServer'
import { HttpTransaction } from './HttpTransaction'

export interface HttpEvents {
  started: {
    info: HttpServerInfo
  }

  closed: void

  exception: Error

  recordDispatched: void

  recorded: {
    mock: string
    mockBody: string
  }

  request: {
    readonly verbose: boolean
    readonly method: HttpMethods
    readonly url: string
    readonly headers: Record<string, string>
    readonly body: unknown
  }

  requestNotMatched: {
    readonly method: HttpMethods
    readonly url: string
    readonly closestMatch?: HttpMock
  }

  requestMatched: {
    readonly verbose: boolean
    readonly start: number
    readonly method: HttpMethods
    readonly url: string
    readonly responseDefinition: {
      readonly status: number
      readonly headers: Record<string, string>
      readonly body: unknown
    }
    readonly mock: {
      id: string
      name: string
      sourceDescription: string
    }
  }

  complete: HttpTransaction
}
