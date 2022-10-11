import { Matcher } from '@mockdog/matchers'
import { HttpConfiguration } from '../../../config/index.js'
import { HttpMockBuilder } from '../../mock_builder.js'
import { MockFile } from './MockFile.js'

export interface FieldParser {
  discoverMatcherByValue<T>(mock: MockFile, value: string): Matcher<T> | undefined

  discoverMatcherByKey<T>(
    filename: string,
    mock: MockFile,
    key: string,
    values: any,
    root: any,
  ): Matcher<T> | undefined

  parse(
    configurations: HttpConfiguration,
    filename: string,
    mock: MockFile,
    mockBuilder: HttpMockBuilder,
  ): Promise<void> | void
}
