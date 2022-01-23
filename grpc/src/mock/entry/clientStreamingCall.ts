import { RpcMockBuilder } from '../RpcMockBuilder.js'
import { ClientStreamingExtendedCall } from '../ClientStreamingExtendedCall.js'
import { UnaryResponse } from '../UnaryResponse.js'

export function clientStreamingCall(): RpcMockBuilder<ClientStreamingExtendedCall, UnaryResponse> {
  return RpcMockBuilder.newBuilder()
}
