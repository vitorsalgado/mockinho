import { Matcher } from '@mockinho/core'
import { HttpMockBuilder } from '../HttpMockBuilder'

export const request = (urlMatcher: Matcher<string> | string): HttpMockBuilder =>
  HttpMockBuilder.newBuilder().url(urlMatcher)
