import { HttpContext } from '../HttpContext'
import { HttpRequest } from '../HttpRequest'
import { HttpMock } from './HttpMock'
import { ResponseFixture } from './ResponseFixture'

export type ResponseDelegate = (
  context: HttpContext,
  request: HttpRequest,
  mock: HttpMock
) => Promise<ResponseFixture>
