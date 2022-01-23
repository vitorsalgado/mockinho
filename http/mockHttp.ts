import { HttpConfigurationBuilder } from './config/index.js'
import { HttpConfiguration } from './config/index.js'
import { MockDogHttp } from './MockDogHttp.js'

export const mockHttp = (
  configurations: HttpConfigurationBuilder | HttpConfiguration
): MockDogHttp => new MockDogHttp(configurations)

export default mockHttp
