import { Matcher } from '@mockinho/core'
import { HttpStubBuilder } from '../HttpStubBuilder'
import { forMethod } from './forMethod'

export const post = (urlMatcher: Matcher<string> | string): HttpStubBuilder =>
  forMethod('POST', urlMatcher)