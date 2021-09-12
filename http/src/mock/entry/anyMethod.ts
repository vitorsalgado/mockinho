import { Matcher } from '@mockinho/core'
import { anything } from '@mockinho/core-matchers'
import { HttpMockBuilder } from '../HttpMockBuilder'

export const anyMethod = (urlMatcher: Matcher<string> | string): HttpMockBuilder =>
  HttpMockBuilder.newBuilder().method(anything()).url(urlMatcher)
