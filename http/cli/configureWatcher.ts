/* eslint-disable no-console */

import * as Fs from 'fs'
import Path from 'path'
import { blue } from 'colorette'
import { red } from 'colorette'
import { loadSingleMockFile } from '@mockdog/core'
import { HttpConfiguration } from '../config/index.js'
import { MockDogHttp } from '../MockDogHttp.js'
import { buildMockFromFile } from '../loaders/default/buildMockFromFile.js'
import MockFileSchema from '../loaders/default/MockFileSchema.js'
import { MockFile } from '../loaders/default/MockFile.js'
import { watcher } from './watcher.js'

export function configureWatcher(config: HttpConfiguration, mockhttp: MockDogHttp): void {
  const fsWatcher = watcher(
    config.mockDirectory,
    {
      cwd: config.rootDir,
      ignored: /(^|[/\\])\../,
      persistent: true,
      interval: 1000,
      ignoreInitial: true,
      usePolling: false,
      atomic: false,
    },

    async path => {
      if (!path || !path.includes('.' + config.mockFilesExtension + '.')) {
        return
      }

      const filename = extractFilename(path)

      try {
        const result = await loadSingleMockFile<MockFile>(path, MockFileSchema)

        if (result.error) {
          return
        }

        for (const mock of result.mocks) {
          mockhttp.mock(await buildMockFromFile(config, mock, path))
        }

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
          const result = await loadSingleMockFile<MockFile>(path, MockFileSchema)

          if (result.error) {
            return
          }

          mockhttp.resetMocks('file')
          await mockhttp.rebuild()

          console.log('Mocks from ' + blue(filename) + ' were ' + blue('updated'))
        } else {
          mockhttp.resetMocks('file')
          await mockhttp.rebuild()

          console.log('Mocks from ' + blue(filename) + ' were ' + blue('removed'))
        }
      } catch (ex) {
        console.error(red('Error updating mocks. Reason: ' + ex))
        console.error(ex)
      }
    },
  )

  mockhttp.on('onClose', () => fsWatcher.close())
}

function extractFilename(path: string) {
  return path.split('/').pop() || ''
}
