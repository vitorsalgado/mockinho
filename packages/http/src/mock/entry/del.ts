import { Matcher } from '@mockinho/core'
import { DecoratedMockBuilder } from '../../types'
import { forMethod } from './forMethod'

export const del = (urlMatcher: Matcher<string> | string): DecoratedMockBuilder =>
  forMethod('DELETE', urlMatcher)
