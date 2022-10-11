import { anyMethod, get, post, put, del, patch, head, request } from './mock_builder.js'
import { HttpConfiguration, HttpConfigurationBuilder } from './config/index.js'
import { MockDogHttp } from './MockDogHttp.js'

export * from './config/index.js'
export * from './feat/hooks/index.js'
export * from './srv.js'
export * from './HttpContext.js'
export * from './request.js'
export * from './mock_builder.js'
export * from './MockDogHttp.js'
export * from './feat/matchers/index.js'
export * from './_internal/errors.js'
export * from './srv.js'
export * from './http.js'

export const req = { anyMethod, get, post, put, del, patch, head, request }
export const httpMock = (
  configurations: HttpConfigurationBuilder | HttpConfiguration,
): MockDogHttp => new MockDogHttp(configurations)

export default httpMock
