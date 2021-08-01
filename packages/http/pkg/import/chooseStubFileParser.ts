import { parseJsonStub, parseYmlFile } from './parseStubFile'
import { StubFile } from './StubFile'

export function chooseStubFileParser(
  extension: string
): (content: string) => StubFile | Array<StubFile> {
  switch (extension) {
    case 'json':
      return parseJsonStub
    case 'yaml':
    case 'yml':
      return parseYmlFile
    default:
      throw new Error(`No parser for extension ${extension}`)
  }
}
