import { ConfigBuilder } from './config'
import { HttpConfiguration } from './config'
import { MockaccinoHttp } from './MockaccinoHttp'

export const mockHttp = (configurations: ConfigBuilder | HttpConfiguration): MockaccinoHttp =>
  new MockaccinoHttp(configurations)

export default mockHttp
