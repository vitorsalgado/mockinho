import { Matcher } from '@mockdog/core'
import { HttpMockBuilder } from '../HttpMockBuilder.js'
import { forMethod } from './forMethod.js'

export const post = (urlMatcher: Matcher<string> | string): HttpMockBuilder =>
  forMethod('POST', urlMatcher)
