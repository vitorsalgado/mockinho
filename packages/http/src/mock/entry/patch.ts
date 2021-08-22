import { Matcher } from '@mockinho/core'
import { DecoratedMockBuilder } from '../../types'
import { forMethod } from './forMethod'

export const patch = (urlMatcher: Matcher<string> | string): DecoratedMockBuilder =>
  forMethod('PATCH', urlMatcher)
