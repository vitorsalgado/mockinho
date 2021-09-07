import { Matcher } from '@mockinho/core'
import { DefaultMockBuilder } from '../../types'
import { forMethod } from './forMethod'

export const options = (urlMatcher: Matcher<string> | string): DefaultMockBuilder =>
  forMethod('OPTIONS', urlMatcher)
