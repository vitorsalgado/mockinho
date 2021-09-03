import './recordWorker'

import Path from 'path'
import { Worker } from 'worker_threads'
import { HttpConfiguration } from '../config'
import { HttpContext } from '../HttpContext'
import { RecordDispatcherArgs } from './RecordDispatcherArgs'
import { RecordData } from './RecordData'

export class RecordDispatcher {
  private readonly worker: Worker
  private readonly configuration: HttpConfiguration

  constructor(private readonly context: HttpContext) {
    this.configuration = context.configuration

    if (!this.configuration.recordOptions) {
      throw new ReferenceError('record options is not defined')
    }

    this.worker = new Worker(Path.join(__dirname, 'recordWorker.js'), {
      workerData: {
        ...this.configuration.recordOptions,
        extension: this.configuration.mockFilesExtension
      } as RecordData
    })

    this.worker.on('message', (mock: string, mockBody: string) =>
      this.context.emit('recorded', { mock, mockBody })
    )
  }

  record(message: RecordDispatcherArgs): void {
    this.worker.postMessage(message)
    this.context.emit('recordDispatched')
  }

  terminate(): Promise<number> {
    return this.worker.terminate()
  }
}
