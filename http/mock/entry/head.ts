import { Matcher } from '@mockdog/core'
import { HttpMockBuilder } from '../HttpMockBuilder.js'
import { forMethod } from './forMethod.js'

export const head = (urlMatcher: Matcher<string> | string): HttpMockBuilder =>
  forMethod('HEAD', urlMatcher)
