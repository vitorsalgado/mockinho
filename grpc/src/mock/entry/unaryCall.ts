import { RpcMockBuilder } from '../RpcMockBuilder.js'
import { UnaryExtendedCall } from '../UnaryExtendedCall.js'
import { UnaryResponse } from '../UnaryResponse.js'

export function unaryCall(): RpcMockBuilder<UnaryExtendedCall, UnaryResponse> {
  return RpcMockBuilder.newBuilder()
}
