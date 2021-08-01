import { Matcher } from '@mockinho/core'
import { HttpStubBuilder } from '../HttpStubBuilder'
import { forMethod } from './forMethod'

export const patch = (urlMatcher: Matcher<string> | string): HttpStubBuilder =>
  forMethod('PATCH', urlMatcher)
