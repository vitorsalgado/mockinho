import { Matcher } from '@mockinho/core'
import { DecoratedStubBuilder } from '../../types'
import { forMethod } from './forMethod'

export const post = (urlMatcher: Matcher<string> | string): DecoratedStubBuilder =>
  forMethod('POST', urlMatcher)
