import { RpcMockBuilder } from '../RpcMockBuilder'
import { ServerStreamingExtendedCall } from '../ServerStreamingExtendedCall'
import { ServerStreamingResponse } from '../ServerStreamingResponse'

export function serverStreamingCall(): RpcMockBuilder<
  ServerStreamingExtendedCall,
  ServerStreamingResponse
> {
  return RpcMockBuilder.newBuilder()
}
