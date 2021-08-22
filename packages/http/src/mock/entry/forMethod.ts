import { Matcher } from '@mockinho/core'
import { HttpMethods } from '../../types'
import { DecoratedMockBuilder } from '../../types'
import { HttpMockBuilder } from '../HttpMockBuilder'

export const forMethod = (
  method: HttpMethods,
  urlMatcher: Matcher<string> | string
): DecoratedMockBuilder => HttpMockBuilder.newBuilder().method(method).url(urlMatcher)
