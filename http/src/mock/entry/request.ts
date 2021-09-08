import { Matcher } from '@mockinho/core'
import { DefaultMockBuilder } from '../../types'
import { HttpMockBuilder } from '../HttpMockBuilder'

export const request = (urlMatcher: Matcher<string> | string): DefaultMockBuilder =>
  HttpMockBuilder.newBuilder().url(urlMatcher)
