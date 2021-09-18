import { Matcher } from '@mockdog/core'
import { HttpMockBuilder } from '../HttpMockBuilder'
import { forMethod } from './forMethod'

export const get = (urlMatcher: Matcher<string> | string): HttpMockBuilder =>
  forMethod('GET', urlMatcher)
