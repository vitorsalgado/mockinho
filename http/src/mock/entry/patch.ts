import { Matcher } from '@mockdog/core'
import { HttpMockBuilder } from '../HttpMockBuilder'
import { forMethod } from './forMethod'

export const patch = (urlMatcher: Matcher<string> | string): HttpMockBuilder =>
  forMethod('PATCH', urlMatcher)
