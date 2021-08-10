import { Matcher } from '@mockinho/core'
import { DecoratedStubBuilder } from '../../types'
import { forMethod } from './forMethod'

export const del = (urlMatcher: Matcher<string> | string): DecoratedStubBuilder =>
  forMethod('DELETE', urlMatcher)
