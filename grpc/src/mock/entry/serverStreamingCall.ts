import { RpcMockBuilder } from '../RpcMockBuilder.js'
import { ServerStreamingExtendedCall } from '../ServerStreamingExtendedCall.js'
import { ServerStreamingResponse } from '../ServerStreamingResponse.js'

export function serverStreamingCall(): RpcMockBuilder<
  ServerStreamingExtendedCall,
  ServerStreamingResponse
> {
  return RpcMockBuilder.newBuilder()
}
