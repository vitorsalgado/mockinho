import { Matcher } from '@mockinho/core'
import { DecoratedStubBuilder } from '../../types'
import { forMethod } from './forMethod'

export const patch = (urlMatcher: Matcher<string> | string): DecoratedStubBuilder =>
  forMethod('PATCH', urlMatcher)
