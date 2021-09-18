import { Matcher } from '@mockdog/core'
import { HttpMockBuilder } from '../HttpMockBuilder'
import { forMethod } from './forMethod'

export const post = (urlMatcher: Matcher<string> | string): HttpMockBuilder =>
  forMethod('POST', urlMatcher)
