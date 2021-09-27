import { MockDogRpc } from './MockDogRpc'
import { RpcConfigurationBuilder } from './config'
import { RpcConfiguration } from './config'

export function mockRpc(config: RpcConfigurationBuilder | RpcConfiguration): MockDogRpc {
  return new MockDogRpc(config)
}
