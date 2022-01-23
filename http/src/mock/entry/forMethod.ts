import { Matcher } from '@mockdog/core'
import { HttpMockBuilder } from '../HttpMockBuilder.js'
import { Methods } from '../../Methods.js'

export const forMethod = (method: Methods, urlMatcher: Matcher<string> | string): HttpMockBuilder =>
  HttpMockBuilder.newBuilder().method(method).url(urlMatcher)
