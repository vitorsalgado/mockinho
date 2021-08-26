import { Matcher } from '@mockinho/core'
import { DefaultMockBuilder } from '../../types'
import { forMethod } from './forMethod'

export const head = (urlMatcher: Matcher<string> | string): DefaultMockBuilder =>
  forMethod('HEAD', urlMatcher)
