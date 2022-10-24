import { Response } from 'express'
import { Mock, MockRepository } from '@mockdog/core'
import { HttpConfiguration } from './config/index.js'
import { SrvResponse } from './reply/index.js'
import { SrvRequest } from './request.js'

export class HttpMock extends Mock<SrvRequest, Response, HttpConfiguration, SrvResponse> {}
export class HttpMockRepository extends MockRepository<HttpMock> {}
