import { RpcConfigurationBuilder } from './RpcConfigurationBuilder.js'

export function options(): RpcConfigurationBuilder {
  return new RpcConfigurationBuilder()
}
