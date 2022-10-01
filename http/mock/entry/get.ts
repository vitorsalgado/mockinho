import { Matcher } from '@mockdog/matchers'
import { HttpMockBuilder } from '../HttpMockBuilder.js'
import { forMethod } from './forMethod.js'

export const get = (urlMatcher: Matcher<string> | string): HttpMockBuilder =>
  forMethod('GET', urlMatcher)
