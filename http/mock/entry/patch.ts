import { Matcher } from '@mockdog/core'
import { HttpMockBuilder } from '../HttpMockBuilder.js'
import { forMethod } from './forMethod.js'

export const patch = (urlMatcher: Matcher<string> | string): HttpMockBuilder =>
  forMethod('PATCH', urlMatcher)
