import Ajv from 'ajv'
import Yaml from 'js-yaml'
import { StubFile } from './StubFile'
import StubSchema from './StubFileSchema'

const ajv = new Ajv()
const validate = ajv.compile(StubSchema)

export interface ParseResult {
  stubs: Array<StubFile>
  file: string
  error?: any
}

export function parseStubFile(file: string, parser: () => StubFile | Array<StubFile>): ParseResult {
  try {
    const stub = parser()
    const isValid = validate(stub)

    if (isValid) {
      return {
        stubs: Array.isArray(stub) ? stub : [stub],
        file
      }
    }

    return { error: validate.errors, file, stubs: [] }
  } catch (ex) {
    return {
      file,
      error: ex.message,
      stubs: []
    }
  }
}

export function parseJsonStub(content: string): StubFile | Array<StubFile> {
  return JSON.parse(content)
}

export function parseYmlFile(content: string): StubFile | Array<StubFile> {
  return Yaml.load(content, { json: true }) as StubFile | Array<StubFile>
}
