import { Matcher } from '@mockdog/matchers'
import { HttpMockBuilder } from '../HttpMockBuilder.js'
import { forMethod } from './forMethod.js'

export const post = (urlMatcher: Matcher<string> | string): HttpMockBuilder =>
  forMethod('POST', urlMatcher)
