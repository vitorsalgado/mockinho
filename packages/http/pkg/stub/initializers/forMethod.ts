import { Matcher } from '@mockinho/core'
import { HttpMethods } from '../../types'
import { DecoratedStubBuilder } from '../../types'
import { HttpStubBuilder } from '../HttpStubBuilder'

export const forMethod = (
  method: HttpMethods,
  urlMatcher: Matcher<string> | string
): DecoratedStubBuilder => HttpStubBuilder.newBuilder().method(method).url(urlMatcher)
