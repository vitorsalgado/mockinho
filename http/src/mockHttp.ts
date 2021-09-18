import { ConfigurationBuilder } from './config'
import { Configuration } from './config'
import { MockDogHttp } from './MockDogHttp'

export const mockHttp = (configurations: ConfigurationBuilder | Configuration): MockDogHttp =>
  new MockDogHttp(configurations)

export default mockHttp
