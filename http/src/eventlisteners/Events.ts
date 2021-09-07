import { HttpMock } from '../mock'
import { HttpMethods } from '../types'
import { Info } from '../HttpServer'
import { Transaction } from './Transaction'

export interface Events {
  readonly start: {
    readonly info: Info
  }

  readonly close: void

  readonly exception: Error

  readonly recordDispatched: void

  readonly recorded: {
    readonly mock: string
    readonly mockBody: string
  }

  readonly request: {
    readonly verbose: boolean
    readonly method: HttpMethods
    readonly url: string
    readonly path: string
    readonly headers: Record<string, string>
    readonly body: unknown
  }

  readonly requestNotMatched: {
    readonly method: HttpMethods
    readonly url: string
    readonly path: string
    readonly closestMatch?: HttpMock
  }

  readonly requestMatched: {
    readonly verbose: boolean
    readonly start: number
    readonly method: HttpMethods
    readonly url: string
    readonly path: string
    readonly responseDefinition: {
      readonly status: number
      readonly headers: Record<string, string>
      readonly body: unknown
    }
    readonly mock: {
      readonly id: string
      readonly name: string
      readonly sourceDescription: string
    }
  }

  readonly complete: Transaction
}
