import { HttpContext } from '../HttpContext.js'
import { SrvRequest } from '../request.js'
import { HttpMock } from './HttpMock.js'
import { ResponseFixture } from './ResponseFixture.js'

export type ResponseDelegate = (
  context: HttpContext,
  request: SrvRequest,
  mock: HttpMock,
) => Promise<ResponseFixture>
