import { Matcher } from '@mockinho/core'
import { anything } from '@mockinho/core-matchers'
import { HttpStubBuilder } from '../HttpStubBuilder'

export const anyMethod = (urlMatcher: Matcher<string> | string): HttpStubBuilder =>
  HttpStubBuilder.newBuilder().method(anything()).url(urlMatcher)
