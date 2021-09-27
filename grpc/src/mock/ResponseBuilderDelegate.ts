import { RpcContext } from '../RpcContext'
import { RpcCall } from '../RpcCall'
import { RpcMock } from './RpcMock'
import { Response } from './Response'

export type ResponseBuilderDelegate<R extends Response> = (
  context: RpcContext,
  request: RpcCall,
  mock: RpcMock
) => Promise<R>
