import { UnaryCall } from '../types'
import { RpcCallContext } from '../RpcCallContext'
import { UnaryExtendedCall } from './UnaryExtendedCall'

export function extendCall<T extends UnaryExtendedCall>(
  call: UnaryCall,
  callContext: RpcCallContext
): T {
  const extendedCall: UnaryExtendedCall = call as unknown as T
  extendedCall.context = callContext

  return extendedCall as T
}
