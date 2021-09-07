import { Matcher } from '@mockinho/core'
import { DefaultMockBuilder } from '../../types'
import { forMethod } from './forMethod'

export const del = (urlMatcher: Matcher<string> | string): DefaultMockBuilder =>
  forMethod('DELETE', urlMatcher)
