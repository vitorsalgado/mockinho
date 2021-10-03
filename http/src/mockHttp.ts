import { HttpConfigurationBuilder } from './config'
import { HttpConfiguration } from './config'
import { MockDogHttp } from './MockDogHttp'

export const mockHttp = (
  configurations: HttpConfigurationBuilder | HttpConfiguration
): MockDogHttp => new MockDogHttp(configurations)

export default mockHttp
