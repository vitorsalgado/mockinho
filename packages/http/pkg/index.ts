import { Configurations, ConfigurationsBuilder } from './config'
import { HttpServerFactory } from './HttpServer'
import { MockinhoHTTP } from './MockinhoHTTP'

export * from './config'
export * from './stub'
export * from './eventlisteners'
export * from './ExpressServer'
export * from './ExpressServerFactory'
export * from './HttpContext'
export * from './HttpRequest'
export * from './HttpServer'
export * from './types'
export * from './MockinhoHTTP'
export * from '@mockinho/core-matchers'
export * from './matchers'

export const mockinhoHTTP = <
  ServerFactory extends HttpServerFactory,
  Config extends Configurations<ServerFactory>
>(
  configurations: ConfigurationsBuilder<ServerFactory, Config>
): MockinhoHTTP<ServerFactory, Config> => new MockinhoHTTP(configurations)

export default mockinhoHTTP
