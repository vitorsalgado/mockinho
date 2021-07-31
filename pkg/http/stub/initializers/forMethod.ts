import { equalsTo, Matcher } from '../../../shared/matchers'
import { HttpMethods } from '../../types'
import { HttpStubBuilder } from '../HttpStubBuilder'

export const forMethod = (
  method: HttpMethods,
  urlMatcher: Matcher<string> | string
): HttpStubBuilder => HttpStubBuilder.newBuilder().method(equalsTo(method)).url(urlMatcher)
