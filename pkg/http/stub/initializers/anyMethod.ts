import { anything, Matcher } from '../../../shared/matchers'
import { HttpStubBuilder } from '../HttpStubBuilder'

export const anyMethod = (urlMatcher: Matcher<string> | string): HttpStubBuilder =>
  HttpStubBuilder.newBuilder().method(anything()).url(urlMatcher)
