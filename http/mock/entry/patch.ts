import { Matcher } from '@mockdog/matchers'
import { HttpMockBuilder } from '../HttpMockBuilder.js'
import { forMethod } from './forMethod.js'

export const patch = (urlMatcher: Matcher<string> | string): HttpMockBuilder =>
  forMethod('PATCH', urlMatcher)
