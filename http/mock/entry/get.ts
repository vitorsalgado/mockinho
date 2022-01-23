import { Matcher } from '@mockdog/core'
import { HttpMockBuilder } from '../HttpMockBuilder.js'
import { forMethod } from './forMethod.js'

export const get = (urlMatcher: Matcher<string> | string): HttpMockBuilder =>
  forMethod('GET', urlMatcher)
