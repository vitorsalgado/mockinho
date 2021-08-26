import { Matcher } from '@mockinho/core'
import { HttpMethods } from '../../types'
import { DefaultMockBuilder } from '../../types'
import { HttpMockBuilder } from '../HttpMockBuilder'

export const forMethod = (
  method: HttpMethods,
  urlMatcher: Matcher<string> | string
): DefaultMockBuilder => HttpMockBuilder.newBuilder().method(method).url(urlMatcher)
