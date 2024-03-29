import { UnaryCall } from '../types.js'
import { RpcCallContext } from '../RpcCallContext.js'
import { UnaryExtendedCall } from './UnaryExtendedCall.js'

export function extendCall<T extends UnaryExtendedCall>(
  call: UnaryCall,
  callContext: RpcCallContext,
): T {
  const extendedCall: UnaryExtendedCall = call as unknown as T
  extendedCall.context = callContext

  return extendedCall as T
}
