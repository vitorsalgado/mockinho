import { Matcher } from '@mockinho/core'
import { DefaultMockBuilder } from '../../types'
import { forMethod } from './forMethod'

export const post = (urlMatcher: Matcher<string> | string): DefaultMockBuilder =>
  forMethod('POST', urlMatcher)
