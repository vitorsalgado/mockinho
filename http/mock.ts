import { Response } from 'express'
import { Mock, MockRepository } from '@mockdog/core'
import { HttpConfiguration } from './config/index.js'
import { MockDogHttp } from './MockDogHttp.js'
import { SrvResponse } from './reply/index.js'
import { SrvRequest } from './request.js'

export type PostActionContext = {
  request: SrvRequest
  response: SrvResponse
  mock: HttpMock
  app: MockDogHttp
}

export class HttpMock extends Mock<
  SrvRequest,
  Response,
  HttpConfiguration,
  SrvResponse,
  PostActionContext
> {}

export class HttpMockRepository extends MockRepository<HttpMock> {}
