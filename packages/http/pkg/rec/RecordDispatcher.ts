import './worker'
import Path from 'path'
import { Worker } from 'worker_threads'
import { execSync } from 'child_process'
import { LoggerUtil } from '@mockinho/core'
import { Configurations } from '../config'
import { RecordArgs } from './RecordArgs'

export class RecordDispatcher {
  private readonly worker: Worker

  constructor(configurations: Configurations) {
    this.worker = new Worker(Path.join(__dirname, 'worker.js'), {
      workerData: { ...configurations.recordOptions, extension: configurations.stubsExtension }
    })

    this.worker.on('message', () => LoggerUtil.instance().debug('Recorded'))

    try {
      execSync(`mkdir -p ${Path.join(configurations.recordOptions.destination)}`)
    } catch (e) {
      LoggerUtil.instance().error(e, e.message)
    }
  }

  record(message: RecordArgs): void {
    this.worker.postMessage(message)
  }

  terminate(): Promise<number> {
    return this.worker.terminate()
  }
}
