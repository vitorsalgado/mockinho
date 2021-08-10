import { Matcher } from '@mockinho/core'
import { Configurations } from '../../config'
import { HttpStubBuilder } from '../../stub'
import { StubFile } from './StubFile'

export interface FieldParser {
  discoverMatcherByValue<T>(value: string): Matcher<T> | undefined

  discoverMatcherByKey<T>(
    filename: string,
    key: string,
    values: any,
    root: any
  ): Matcher<T> | undefined

  parse(
    configurations: Configurations,
    filename: string,
    stub: StubFile,
    stubBuilder: HttpStubBuilder
  ): void
}
