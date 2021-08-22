import { Matcher } from '@mockinho/core'
import { anything } from '@mockinho/core-matchers'
import { HttpMockBuilder } from '../HttpMockBuilder'
import { DecoratedMockBuilder } from '../../types'

export const anyMethod = (urlMatcher: Matcher<string> | string): DecoratedMockBuilder =>
  HttpMockBuilder.newBuilder().method(anything()).url(urlMatcher)
