import { Matcher } from '@mockinho/core'
import { DecoratedStubBuilder } from '../../types'
import { forMethod } from './forMethod'

export const options = (urlMatcher: Matcher<string> | string): DecoratedStubBuilder =>
  forMethod('OPTIONS', urlMatcher)
