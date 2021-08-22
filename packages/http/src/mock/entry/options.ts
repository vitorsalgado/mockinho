import { Matcher } from '@mockinho/core'
import { DecoratedMockBuilder } from '../../types'
import { forMethod } from './forMethod'

export const options = (urlMatcher: Matcher<string> | string): DecoratedMockBuilder =>
  forMethod('OPTIONS', urlMatcher)
