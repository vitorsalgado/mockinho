import './recordWorker'

import Path from 'path'
import { Worker } from 'worker_threads'
import { notNull } from '@mockinho/core'
import { Configuration } from '../../config'
import { HttpContext } from '../../HttpContext'
import { RecordArgs } from './RecordArgs'
import { RecordOptions } from './RecordOptions'

export class RecordDispatcher {
  private readonly worker: Worker
  private readonly configuration: Configuration

  constructor(private readonly context: HttpContext) {
    this.configuration = context.configuration

    notNull(this.configuration.recordOptions)

    this.worker = new Worker(Path.join(__dirname, 'recordWorker.js'), {
      workerData: {
        ...this.configuration.recordOptions,
        extension: this.configuration.mockFilesExtension,
        captureResponseHeaders: this.configuration.recordOptions?.captureResponseHeaders,
        captureRequestHeaders: this.configuration.recordOptions?.captureRequestHeaders
      } as RecordOptions & { extension: string }
    })
  }

  init(): void {
    this.worker.on('message', (mock: string, mockBody: string) =>
      this.context.emit('onRecord', { mock, mockBody })
    )
  }

  record(message: RecordArgs): void {
    this.worker.postMessage(message)
    this.context.emit('onRecordDispatched')
  }

  terminate(): Promise<number> {
    return this.worker.terminate()
  }
}
