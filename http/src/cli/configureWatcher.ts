/* eslint-disable no-console */

import * as Fs from 'fs'
import Path from 'path'
import { blue } from 'colorette'
import { red } from 'colorette'
import { Configuration } from '../config'
import { MockaccinoHttp } from '../MockaccinoHttp'
import { loadSingleMockFile } from '../mock/providers/default/loadSingleMockFile'
import { buildMockFromFile } from '../mock/providers/default/buildMockFromFile'
import { watcher } from './watcher'

export function configureWatcher(config: Configuration, mockhttp: MockaccinoHttp): void {
  const fsWatcher = watcher(
    config.mockDirectory,
    {
      cwd: config.rootDir,
      ignored: /(^|[/\\])\../,
      persistent: true,
      interval: 1000,
      ignoreInitial: true,
      usePolling: false,
      atomic: false
    },

    async path => {
      if (!path || !path.includes('.' + config.mockFilesExtension + '.')) {
        return
      }

      const filename = extractFilename(path)

      try {
        const result = await loadSingleMockFile(path)

        if (result.error) {
          return
        }

        mockhttp.mock(...result.mocks.map(mock => buildMockFromFile(config, mock, path)))

        console.log('Mocks from ' + blue(filename) + ' were ' + blue('added'))
      } catch (ex) {
        console.error(red('Error adding new mocks. Reason: ' + ex))
        console.error(ex)
      }
    },

    async path => {
      if (!path) {
        return
      }

      try {
        const filename = extractFilename(path)
        const exists = Fs.existsSync(Path.resolve(path))

        if (exists) {
          const result = await loadSingleMockFile(path)

          if (result.error) {
            return
          }

          mockhttp.removeBy('file')
          await mockhttp.rebuild()

          console.log('Mocks from ' + blue(filename) + ' were ' + blue('updated'))
        } else {
          mockhttp.removeBy('file')
          await mockhttp.rebuild()

          console.log('Mocks from ' + blue(filename) + ' were ' + blue('removed'))
        }
      } catch (ex) {
        console.error(red('Error updating mocks. Reason: ' + ex))
        console.error(ex)
      }
    }
  )

  mockhttp.on('close', () => fsWatcher.close())
}

function extractFilename(path: string) {
  return path.split('/').pop() || ''
}
