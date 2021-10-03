/* eslint-disable no-console */

import * as Fs from 'fs'
import { red, bold } from 'colorette'
import { JsonType } from '../types'
import { listFilenames } from '../io'
import { noNullElements } from '../checks'
import { notBlank } from '../checks'
import { notEmpty } from '../checks'
import { loadSingleMockFile } from './loadSingleMockFile'
import { LoadMockError } from './LoadMockError'

export async function loadMockFiles<T>(
  mockRoot: string,
  extensions: Array<string>,
  schema: JsonType,
  throwOnErrors: boolean = true
): Promise<Array<{ mockFile: Array<T>; filename: string }>> {
  notBlank(mockRoot)
  notEmpty(extensions)
  noNullElements(extensions)

  if (!Fs.existsSync(mockRoot)) {
    return []
  }

  const parseResults = await Promise.all(
    listFilenames(mockRoot, isMockFile(extensions)).map(file => loadSingleMockFile<T>(file, schema))
  )

  const errors = parseResults.filter(x => x.error)

  if (errors.length > 0) {
    console.error(
      `${red(`${bold('Some mock files contain errors! Check below for more details.')}`)}`
    )

    errors.forEach(error => {
      console.error(error.file.split('/').pop())
      console.error(error.error)
    })

    if (throwOnErrors) {
      throw new LoadMockError('Some mock files are invalid. Finishing loading.', mockRoot)
    }
  }

  return parseResults
    .filter(x => !x.error)
    .map(x => ({
      filename: x.file,
      mockFile: x.mocks as Array<T>
    }))
}

const isMockFile =
  (extensions: Array<string>) =>
  (filename: string): boolean =>
    extensions.some(x => filename.indexOf(x) > -1)
