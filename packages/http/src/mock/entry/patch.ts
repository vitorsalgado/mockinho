import { Matcher } from '@mockinho/core'
import { DefaultMockBuilder } from '../../types'
import { forMethod } from './forMethod'

export const patch = (urlMatcher: Matcher<string> | string): DefaultMockBuilder =>
  forMethod('PATCH', urlMatcher)
