import { RpcConfigurationBuilder } from './RpcConfigurationBuilder'

export function options(): RpcConfigurationBuilder {
  return new RpcConfigurationBuilder()
}
