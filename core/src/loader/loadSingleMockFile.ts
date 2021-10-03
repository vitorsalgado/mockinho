import Fs from 'fs'
import { JsonType } from '../types'
import { createParser } from './createParser'
import { ParseResult } from './ParseResult'

export async function loadSingleMockFile<T>(
  file: string,
  schema: JsonType
): Promise<ParseResult<T>> {
  const parser = createParser<T>(file, schema)

  return new Promise<ParseResult<T>>((resolve, reject) =>
    Fs.readFile(file, 'utf-8', function (err, data) {
      return err ? reject(err) : resolve(parser(data))
    })
  )
}
