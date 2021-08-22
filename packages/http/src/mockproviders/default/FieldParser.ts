import { Matcher } from '@mockinho/core'
import { HttpConfiguration } from '../../config'
import { HttpMockBuilder } from '../../mock'
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
    configurations: HttpConfiguration,
    filename: string,
    mock: MockFile,
    mockBuilder: HttpMockBuilder
  ): void
}
