import { Matcher } from '@mockinho/core'
import { DecoratedStubBuilder } from '../../types'
import { forMethod } from './forMethod'

export const head = (urlMatcher: Matcher<string> | string): DecoratedStubBuilder =>
  forMethod('HEAD', urlMatcher)
