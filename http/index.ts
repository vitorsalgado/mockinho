import { request, anyMethod, get, post, put, del, patch, head } from './builder.js'
import { HttpConfiguration, HttpConfigurationBuilder } from './config/index.js'
import { MockDogHttp } from './MockDogHttp.js'

export * from './config/index.js'
export * from './feat/hooks/index.js'
export * from './srv.js'
export * from './HttpContext.js'
export * from './request.js'
export * from './builder.js'
export * from './MockDogHttp.js'
export * from './feat/matchers/index.js'
export * from './_internal/errors.js'
export * from './srv.js'
export * from './http.js'

export const req = { request, anyMethod, get, post, put, del, patch, head }
export * as res from './reply/replies.js'

export const httpMock = (
  configurations: HttpConfigurationBuilder | HttpConfiguration,
): MockDogHttp => new MockDogHttp(configurations)
