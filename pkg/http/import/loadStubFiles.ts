/* eslint-disable no-console */

import Chalk from 'chalk'
import * as Fs from 'fs'
import { listFilenames } from '../../../internal/io/file/listFilenames'
import { noNullElements } from '../../../internal/preconditions/noNullElements'
import { notBlank } from '../../../internal/preconditions/notBlank'
import { notEmpty } from '../../../internal/preconditions/notEmpty'
import { chooseStubFileParser } from './chooseStubFileParser'
import { InvalidStubFileError } from './InvalidStubFileError'
import { ParseResult, parseStubFile } from './parseStubFile'
import { StubFile } from './StubFile'

const isStubFile =
  (extensions: Array<string>, contentDir: string) =>
  (filename: string): boolean =>
    extensions.some(x => filename.indexOf(x) > -1 && filename.indexOf(contentDir) < 0)

const ext = (filename: string): string => filename.split('.').pop()!

export async function loadStubFiles(
  stubRoot: string,
  stubBodiesRoot: string,
  extensions: Array<string>,
  throwOnErrors: boolean = true
): Promise<Array<{ stubFile: Array<StubFile>; filename: string }>> {
  notBlank(stubRoot)
  notBlank(stubBodiesRoot)
  notEmpty(extensions)
  noNullElements(extensions)

  if (!Fs.existsSync(stubRoot)) {
    return []
  }

  const parseResults = await Promise.all(
    listFilenames(stubRoot, isStubFile(extensions, stubBodiesRoot)).map(
      file =>
        new Promise<ParseResult>((resolve, reject) =>
          Fs.readFile(file, 'utf-8', (err, data) =>
            err
              ? reject(err)
              : resolve(parseStubFile(file, () => chooseStubFileParser(ext(file))(data)))
          )
        )
    )
  )

  const errors = parseResults.filter(x => x.error)

  if (errors.length > 0) {
    console.error(
      `${Chalk.red(
        `${Chalk.bold('Some Stub files contain errors! Check below for more details.')}`
      )}`
    )

    errors.forEach(error => {
      console.error(error.file.split('/').pop())
      console.error(error.error)
    })

    if (throwOnErrors) {
      throw new InvalidStubFileError('Some stub files are invalid. Finishing loading.', stubRoot)
    }
  }

  return parseResults
    .filter(x => !x.error)
    .map(x => ({
      filename: x.file
        .split('/')
        .slice(x.file.split('/').findIndex(y => y === stubRoot.split('/').pop()))
        .join('/'),
      stubFile: x.stubs
    }))
}
