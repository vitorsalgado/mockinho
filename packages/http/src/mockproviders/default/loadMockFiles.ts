/* eslint-disable no-console */

import * as Fs from 'fs'
import { red, bold } from 'colorette'
import { listFilenames, noNullElements, notBlank, notEmpty } from '@mockinho/core'
import { chooseMockFileParser } from './chooseMockFileParser'
import { InvalidMockFileError } from './InvalidMockFileError'
import { ParseResult, parseMockFile } from './parseMockFile'
import { MockFile } from './MockFile'

export async function loadMockFiles(
  mockRoot: string,
  extensions: Array<string>,
  throwOnErrors: boolean = true
): Promise<Array<{ mockFile: Array<MockFile>; filename: string }>> {
  notBlank(mockRoot)
  notEmpty(extensions)
  noNullElements(extensions)

  if (!Fs.existsSync(mockRoot)) {
    return []
  }

  const parseResults = await Promise.all(
    listFilenames(mockRoot, isMockFile(extensions)).map(
      file =>
        new Promise<ParseResult>((resolve, reject) =>
          Fs.readFile(file, 'utf-8', (err, data) =>
            err
              ? reject(err)
              : resolve(parseMockFile(file, () => chooseMockFileParser(ext(file))(data)))
          )
        )
    )
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
      throw new InvalidMockFileError('Some mock files are invalid. Finishing loading.', mockRoot)
    }
  }

  return parseResults
    .filter(x => !x.error)
    .map(x => ({
      filename: x.file,
      mockFile: x.mocks
    }))
}

const isMockFile =
  (extensions: Array<string>) =>
  (filename: string): boolean =>
    extensions.some(x => filename.indexOf(x) > -1)

const ext = (filename: string): string => filename.split('.').pop()!
