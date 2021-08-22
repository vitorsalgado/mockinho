import { Matcher } from '@mockinho/core'
import { DecoratedMockBuilder } from '../../types'
import { forMethod } from './forMethod'

export const put = (urlMatcher: Matcher<string> | string): DecoratedMockBuilder =>
  forMethod('PUT', urlMatcher)
