import { RpcContext } from '../RpcContext'
import { RpcMock } from './RpcMock'
import { Response } from './Response'

export type ResponseBuilderDelegate<REQUEST, RESPONSE extends Response> = (
  context: RpcContext,
  request: REQUEST,
  mock: RpcMock
) => Promise<RESPONSE>
