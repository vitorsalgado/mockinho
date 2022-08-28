import './recordWorker.js'

import Path from 'path'
import { Worker } from 'worker_threads'
import { execSync } from 'child_process'
import { HttpConfiguration } from '../config/index.js'
import { HttpContext } from '../HttpContext.js'
import { RecordArgs } from './RecordArgs.js'
import { RecordOptions } from './RecordOptions.js'
import { Result } from './Result.js'

export class RecordDispatcher {
  private readonly worker: Worker
  private readonly configuration: HttpConfiguration

  constructor(private readonly context: HttpContext) {
    this.configuration = context.configuration

    if (!this.configuration.recordOptions || !this.configuration.recordOptions.destination) {
      throw new Error('You must provide at least the record destination.')
    }

    this.worker = new Worker(Path.join(__dirname, 'recordWorker.js'), {
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
      this.context.emit('onError', error)
    }
  }

  init(): void {
    this.worker.on('message', (result: Result | Error) => {
      if (result instanceof Error) {
        this.context.emit('onError', result)
        return
      }

      this.context.emit('onRecord', result)
    })
  }

  record(message: RecordArgs): void {
    this.worker.postMessage(message)
    this.context.emit('onRecordDispatched')
  }

  terminate(): Promise<number> {
    return this.worker.terminate()
  }
}
