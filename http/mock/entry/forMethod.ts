import { Matcher } from '@mockdog/matchers'
import { Methods } from '../../http.js'
import { HttpMockBuilder } from '../HttpMockBuilder.js'

export const forMethod = (method: Methods, urlMatcher: Matcher<string> | string): HttpMockBuilder =>
  HttpMockBuilder.newBuilder().method(method).url(urlMatcher)
