import Fs from 'fs'
import { ParseResult } from './parseMockFile'
import { parseMockFile } from './parseMockFile'
import { chooseMockFileParser } from './chooseMockFileParser'
import { ext } from './utils/ext'

export async function loadSingleMockFile(file: string): Promise<ParseResult> {
  return new Promise<ParseResult>((resolve, reject) =>
    Fs.readFile(file, 'utf-8', (err, data) =>
      err ? reject(err) : resolve(parseMockFile(file, () => chooseMockFileParser(ext(file))(data)))
    )
  )
}
