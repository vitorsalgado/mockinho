import { parseJsonFile, parseYmlFile } from './parseMockFile'
import { MockFile } from './MockFile'

export function chooseMockFileParser(
  extension: string
): (content: string) => MockFile | Array<MockFile> {
  switch (extension.toLowerCase()) {
    case 'json':
      return parseJsonFile
    case 'yaml':
    case 'yml':
      return parseYmlFile
    default:
      throw new Error(`No parser for extension ${extension}`)
  }
}
