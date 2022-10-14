import './worker.js'

import { execSync } from 'child_process'
import http from 'node:http'
import Path from 'node:path'
import { Worker } from 'node:worker_threads'
import { HttpConfiguration } from '../../config/index.js'
import { BodyType, Methods } from '../../http.js'
import type { MockDogHttp } from '../../MockDogHttp.js'
import { RecordOptions } from './options.js'

export interface RecordArgs {
  request: {
    id: string
    url: string
    path: string
    method: Methods
    headers: http.IncomingHttpHeaders
    query: URLSearchParams
    body: BodyType
  }
  response: {
    status: number
    headers: Record<string, string>
    body: Buffer
  }
}

export interface Result {
  mock: string
  mockBody?: string
}

export class RecordDispatcher {
  private readonly worker: Worker
  private readonly configuration: HttpConfiguration

  constructor(private readonly app: MockDogHttp) {
    this.configuration = app.config

    if (!this.configuration.recordOptions || !this.configuration.recordOptions.destination) {
      throw new Error('You must provide at least the record destination.')
    }

    this.worker = new Worker(Path.join(__dirname, 'worker.js'), {
      workerData: {
        ...this.configuration.recordOptions,
        extension: this.configuration.mockFilesExtension,
        captureResponseHeaders: this.configuration.recordOptions?.captureResponseHeaders,
        captureRequestHeaders: this.configuration.recordOptions?.captureRequestHeaders,
      } as RecordOptions & { extension: string },
    })

    try {
      execSync(`mkdir -p ${Path.join(this.configuration.recordOptions.destination)}`)
    } catch (e) {
      const error = e as Error
      this.app.hooks.emit('onError', error)
    }
  }

  init(): void {
    this.worker.on('message', (result: Result | Error) => {
      if (result instanceof Error) {
        this.app.hooks.emit('onError', result)
        return
      }

      this.app.hooks.emit('onRecord', result)
    })
  }

  record(message: RecordArgs): void {
    this.worker.postMessage(message)
    this.app.hooks.emit('onRecordDispatched')
  }

  terminate(): Promise<number> {
    return this.worker.terminate()
  }
}
