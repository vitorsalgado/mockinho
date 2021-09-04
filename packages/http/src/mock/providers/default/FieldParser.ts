import { Matcher } from '@mockinho/core'
import { Configuration } from '../../../config'
import { HttpMockBuilder } from '../..'
import { MockFile } from './MockFile'

export interface FieldParser {
  discoverMatcherByValue<T>(value: string): Matcher<T> | undefined

  discoverMatcherByKey<T>(
    filename: string,
    key: string,
    values: any,
    root: any
  ): Matcher<T> | undefined

  parse(
    configurations: Configuration,
    filename: string,
    mock: MockFile,
    mockBuilder: HttpMockBuilder
  ): void
}
