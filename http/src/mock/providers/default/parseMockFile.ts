import Ajv from 'ajv'
import Yaml from 'js-yaml'
import { MockFile } from './MockFile'
import MockSchema from './MockFileSchema'

const ajv = new Ajv()
const validate = ajv.compile(MockSchema)

export interface ParseResult {
  mocks: Array<MockFile>
  file: string
  error?: any
}

export function parseMockFile(file: string, parser: () => MockFile | Array<MockFile>): ParseResult {
  try {
    const mock = parser()
    const isValid = validate(mock)

    if (isValid) {
      return {
        mocks: Array.isArray(mock) ? mock : [mock],
        file
      }
    }

    return { error: validate.errors, file, mocks: [] }
  } catch (ex: any) {
    return {
      file,
      error: ex.message,
      mocks: []
    }
  }
}

export function parseJsonFile(content: string): MockFile | Array<MockFile> {
  return JSON.parse(content)
}

export function parseYmlFile(content: string): MockFile | Array<MockFile> {
  return Yaml.load(content, { json: true }) as MockFile | Array<MockFile>
}
