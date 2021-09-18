import { Matcher } from '@mockdog/core'
import { Configuration } from '../../../config'
import { HttpMockBuilder } from '../..'
import { MockFile } from './MockFile'

export interface FieldParser {
  discoverMatcherByValue<T>(mock: MockFile, value: string): Matcher<T> | undefined

  discoverMatcherByKey<T>(
    filename: string,
    mock: MockFile,
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
