import { Matcher } from '@mockinho/core'
import { DecoratedStubBuilder } from '../../types'
import { forMethod } from './forMethod'

export const put = (urlMatcher: Matcher<string> | string): DecoratedStubBuilder =>
  forMethod('PUT', urlMatcher)
