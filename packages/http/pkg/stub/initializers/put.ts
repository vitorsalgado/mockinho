import { Matcher } from '@mockinho/core'
import { HttpStubBuilder } from '../HttpStubBuilder'
import { forMethod } from './forMethod'

export const put = (urlMatcher: Matcher<string> | string): HttpStubBuilder =>
  forMethod('PUT', urlMatcher)
