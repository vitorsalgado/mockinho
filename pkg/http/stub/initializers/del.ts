import { Matcher } from '../../../shared/matchers'
import { HttpStubBuilder } from '../HttpStubBuilder'
import { forMethod } from './forMethod'

export const del = (urlMatcher: Matcher<string> | string): HttpStubBuilder =>
  forMethod('DELETE', urlMatcher)
