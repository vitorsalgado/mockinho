import { Matcher } from '@mockinho/core'
import { DecoratedStubBuilder } from '../../types'
import { forMethod } from './forMethod'

export const get = (urlMatcher: Matcher<string> | string): DecoratedStubBuilder =>
  forMethod('GET', urlMatcher)
