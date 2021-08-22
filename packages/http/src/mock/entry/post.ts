import { Matcher } from '@mockinho/core'
import { DecoratedMockBuilder } from '../../types'
import { forMethod } from './forMethod'

export const post = (urlMatcher: Matcher<string> | string): DecoratedMockBuilder =>
  forMethod('POST', urlMatcher)
