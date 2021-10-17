import { RpcMockBuilder } from '../RpcMockBuilder'
import { UnaryExtendedCall } from '../UnaryExtendedCall'
import { UnaryResponse } from '../UnaryResponse'

export function unaryCall(): RpcMockBuilder<UnaryExtendedCall, UnaryResponse> {
  return RpcMockBuilder.newBuilder()
}
