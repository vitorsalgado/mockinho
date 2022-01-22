import Ajv from 'ajv'
import Yaml from 'js-yaml'
import { JsonType } from '../types'
import { ParseResult } from './ParseResult'
import { extractExtension } from './util/extractExtension'

export function createParser<T>(file: string, schema: JsonType): (data: string) => ParseResult<T> {
  const ajv = new Ajv()
  const validate = ajv.compile(schema)
  const parser = chooseParser(extractExtension(file))

  return function (data: string): ParseResult<T> {
    try {
      const mock = parser(data)
      const isValid = validate(mock)

      if (isValid) {
        return {
          mocks: Array.isArray(mock) ? mock : [mock],
          file
        }
      }

      return { error: validate.errors, file, mocks: [] }
    } catch (ex: unknown) {
      const error = ex as Error

      return {
        file,
        error: error.message,
        mocks: []
      }
    }
  }
}

function parseJsonFile<T>(content: string): T | Array<T> {
  return JSON.parse(content)
}

function parseYmlFile<T>(content: string): T | Array<T> {
  return Yaml.load(content, { json: true }) as T | Array<T>
}

function chooseParser<T>(extension: string): (content: string) => T | Array<T> {
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
