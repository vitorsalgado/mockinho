import { Matcher } from '@mockinho/core'
import { HttpStubBuilder } from '../HttpStubBuilder'
import { forMethod } from './forMethod'

export const get = (urlMatcher: Matcher<string> | string): HttpStubBuilder =>
  forMethod('GET', urlMatcher)
