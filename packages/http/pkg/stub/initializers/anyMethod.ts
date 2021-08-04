import { Matcher } from '@mockinho/core'
import { anything } from '@mockinho/core-matchers'
import { HttpStubBuilder } from '../HttpStubBuilder'
import { DecoratedStubBuilder } from '../../types'

export const anyMethod = (urlMatcher: Matcher<string> | string): DecoratedStubBuilder =>
  HttpStubBuilder.newBuilder().method(anything()).url(urlMatcher)
