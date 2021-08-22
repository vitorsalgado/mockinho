import './recordWorker'
import Path from 'path'
import { Worker } from 'worker_threads'
import { execSync } from 'child_process'
import { LoggerUtil } from '@mockinho/core'
import { HttpConfiguration } from '../config'
import { RecordDispatcherArgs } from './RecordDispatcherArgs'
import { RecordData } from './RecordData'

export class RecordDispatcher {
  private readonly worker: Worker

  constructor(configurations: HttpConfiguration) {
    if (!configurations.recordOptions) {
      throw new ReferenceError('record options is not defined')
    }

    this.worker = new Worker(Path.join(__dirname, 'recordWorker.js'), {
      workerData: {
        ...configurations.recordOptions,
        extension: configurations.mocksExtension
      } as RecordData
    })

    this.worker.on('message', () => LoggerUtil.instance().debug('Recorded'))

    try {
      execSync(`mkdir -p ${Path.join(configurations.recordOptions.destination)}`)
    } catch (e) {
      LoggerUtil.instance().error(e, e.message)
    }
  }

  record(message: RecordDispatcherArgs): void {
    this.worker.postMessage(message)
  }

  terminate(): Promise<number> {
    return this.worker.terminate()
  }
}
