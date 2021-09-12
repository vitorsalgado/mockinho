import { Matcher } from '@mockinho/core'
import { HttpMockBuilder } from '../HttpMockBuilder'
import { forMethod } from './forMethod'

export const put = (urlMatcher: Matcher<string> | string): HttpMockBuilder =>
  forMethod('PUT', urlMatcher)
