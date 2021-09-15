import { HttpMock } from '../mock'
import { Info } from '../Info'
import { Methods } from '../Methods'
import { Transaction } from './Transaction'

export interface Hooks {
  readonly onStart: {
    readonly info: Info
  }

  readonly onClose: void

  readonly onError: Error

  readonly onRecordDispatched: void

  readonly onRecord: {
    readonly mock: string
    readonly mockBody?: string
  }

  readonly onRequestStart: {
    readonly verbose: boolean
    readonly method: Methods
    readonly url: string
    readonly path: string
    readonly headers: Record<string, string>
    readonly body: unknown
  }

  readonly onRequestNotMatched: {
    readonly verbose: boolean
    readonly method: Methods
    readonly url: string
    readonly path: string
    readonly closestMatch?: HttpMock
  }

  readonly onRequestMatched: {
    readonly verbose: boolean
    readonly start: number
    readonly method: Methods
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

  readonly onProxyRequest: {
    target: string
  }

  readonly onProxyResponse: {
    readonly verbose: boolean
    readonly start: number
    readonly method: Methods
    readonly url: string
    readonly path: string
    readonly response: {
      readonly status: number
      readonly headers: Record<string, string>
    }
  }

  readonly onRequestEnd: Transaction
}
