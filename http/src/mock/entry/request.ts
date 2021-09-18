import { Matcher } from '@mockdog/core'
import { HttpMockBuilder } from '../HttpMockBuilder'

export const request = (urlMatcher: Matcher<string> | string): HttpMockBuilder =>
  HttpMockBuilder.newBuilder().url(urlMatcher)
