import { RpcMockBuilder } from '../RpcMockBuilder'
import { ClientStreamingExtendedCall } from '../ClientStreamingExtendedCall'
import { UnaryResponse } from '../UnaryResponse'

export function clientStreamingCall(): RpcMockBuilder<ClientStreamingExtendedCall, UnaryResponse> {
  return RpcMockBuilder.newBuilder()
}
