import { Matcher } from '@mockinho/core'
import { HttpStubBuilder } from '../HttpStubBuilder'
import { forMethod } from './forMethod'

export const options = (urlMatcher: Matcher<string> | string): HttpStubBuilder =>
  forMethod('OPTIONS', urlMatcher)