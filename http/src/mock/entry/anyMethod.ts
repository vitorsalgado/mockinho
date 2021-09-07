import { Matcher } from '@mockinho/core'
import { anything } from '@mockinho/core-matchers'
import { HttpMockBuilder } from '../HttpMockBuilder'
import { DefaultMockBuilder } from '../../types'

export const anyMethod = (urlMatcher: Matcher<string> | string): DefaultMockBuilder =>
  HttpMockBuilder.newBuilder().method(anything()).url(urlMatcher)
