import { Matcher } from '../../../shared/matchers'
import { HttpStubBuilder } from '../HttpStubBuilder'
import { forMethod } from './forMethod'

export const head = (urlMatcher: Matcher<string> | string): HttpStubBuilder =>
  forMethod('HEAD', urlMatcher)
