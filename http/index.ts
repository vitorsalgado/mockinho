import { HttpConfiguration, HttpConfigurationBuilder } from './config/index.js'
import { MockDogHttp } from './MockDogHttp.js'

export * from './config/index.js'
export * from './features/hooks/index.js'
export * from './mock/index.js'
export * from './srv.js'
export * from './HttpContext.js'
export * from './request.js'
export * from './MockDogHttp.js'
export * from './features/matchers/index.js'
export * from './_internal/errors.js'
export * from './srv.js'
export * from './http.js'

export const httpMock = (
  configurations: HttpConfigurationBuilder | HttpConfiguration,
): MockDogHttp => new MockDogHttp(configurations)

export default httpMock
