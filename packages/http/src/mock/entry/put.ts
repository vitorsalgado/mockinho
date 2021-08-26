import { Matcher } from '@mockinho/core'
import { DefaultMockBuilder } from '../../types'
import { forMethod } from './forMethod'

export const put = (urlMatcher: Matcher<string> | string): DefaultMockBuilder =>
  forMethod('PUT', urlMatcher)
