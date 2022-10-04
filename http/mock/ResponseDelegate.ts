import { HttpContext } from '../HttpContext.js'
import { HttpRequest } from '../request.js'
import { HttpMock } from './HttpMock.js'
import { ResponseFixture } from './ResponseFixture.js'

export type ResponseDelegate = (
  context: HttpContext,
  request: HttpRequest,
  mock: HttpMock,
) => Promise<ResponseFixture>
