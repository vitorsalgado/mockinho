import { Matcher } from '@mockdog/core'
import { anything } from '@mockdog/core-matchers'
import { HttpMockBuilder } from '../HttpMockBuilder.js'

export const anyMethod = (urlMatcher: Matcher<string> | string): HttpMockBuilder =>
  HttpMockBuilder.newBuilder().method(anything()).url(urlMatcher)
