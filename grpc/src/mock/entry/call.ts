import { RpcMockBuilder } from '../RpcMockBuilder'

export function call(): RpcMockBuilder {
  return RpcMockBuilder.newBuilder()
}
