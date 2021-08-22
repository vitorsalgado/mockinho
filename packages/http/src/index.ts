import { MockaccinoHttp } from './MockaccinoHttp'
import { HttpConfigurationBuilder } from './config'

export * from '@mockinho/core-matchers'

export * from './config'
export * from './mock'
export * from './eventlisteners'
export * from './HttpServer'
export * from './HttpContext'
export * from './HttpRequest'
export * from './types'
export * from './MockaccinoHttp'
export * from './matchers'

export const mockaccinoHttp = (configurations: HttpConfigurationBuilder): MockaccinoHttp =>
  new MockaccinoHttp(configurations)

export default mockaccinoHttp
