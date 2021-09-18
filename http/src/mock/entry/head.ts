import { Matcher } from '@mockdog/core'
import { HttpMockBuilder } from '../HttpMockBuilder'
import { forMethod } from './forMethod'

export const head = (urlMatcher: Matcher<string> | string): HttpMockBuilder =>
  forMethod('HEAD', urlMatcher)
