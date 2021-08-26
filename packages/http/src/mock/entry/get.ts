import { Matcher } from '@mockinho/core'
import { DefaultMockBuilder } from '../../types'
import { forMethod } from './forMethod'

export const get = (urlMatcher: Matcher<string> | string): DefaultMockBuilder =>
  forMethod('GET', urlMatcher)
