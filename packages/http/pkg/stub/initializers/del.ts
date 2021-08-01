import { Matcher } from '@mockinho/core'
import { HttpStubBuilder } from '../HttpStubBuilder'
import { forMethod } from './forMethod'

export const del = (urlMatcher: Matcher<string> | string): HttpStubBuilder =>
  forMethod('DELETE', urlMatcher)
