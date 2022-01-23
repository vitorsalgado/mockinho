import { MockDogRpc } from './MockDogRpc.js'
import { RpcConfigurationBuilder } from './config/mod.js'
import { RpcConfiguration } from './config/mod.js'

export function mockRpc(config: RpcConfigurationBuilder | RpcConfiguration): MockDogRpc {
  return new MockDogRpc(config)
}
