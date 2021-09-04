import { ConfigurationBuilder } from './config'
import { Configuration } from './config'
import { MockaccinoHttp } from './MockaccinoHttp'

export const mockHttp = (configurations: ConfigurationBuilder | Configuration): MockaccinoHttp =>
  new MockaccinoHttp(configurations)

export default mockHttp
