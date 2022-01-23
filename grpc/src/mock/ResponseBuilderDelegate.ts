import { RpcContext } from '../RpcContext.js'
import { RpcMock } from './RpcMock.js'
import { Response } from './Response.js'

export type ResponseBuilderDelegate<REQUEST, RESPONSE extends Response> = (
  context: RpcContext,
  request: REQUEST,
  mock: RpcMock
) => Promise<RESPONSE>
