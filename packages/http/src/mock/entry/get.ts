import { Matcher } from '@mockinho/core'
import { DecoratedMockBuilder } from '../../types'
import { forMethod } from './forMethod'

export const get = (urlMatcher: Matcher<string> | string): DecoratedMockBuilder =>
  forMethod('GET', urlMatcher)
