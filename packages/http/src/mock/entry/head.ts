import { Matcher } from '@mockinho/core'
import { DecoratedMockBuilder } from '../../types'
import { forMethod } from './forMethod'

export const head = (urlMatcher: Matcher<string> | string): DecoratedMockBuilder =>
  forMethod('HEAD', urlMatcher)
