import { Matcher } from '@mockinho/core'
import { HttpMockBuilder } from '../HttpMockBuilder'
import { forMethod } from './forMethod'

export const del = (urlMatcher: Matcher<string> | string): HttpMockBuilder =>
  forMethod('DELETE', urlMatcher)
