import { Configurations, ConfigurationsBuilder } from './config'
import { HttpServerFactory } from './HttpServer'
import { MockinhoHTTP } from './MockinhoHTTP'

export * from './config'
export * from './stub'
export * from './eventlisteners'
export * from './FastifyHttpServer'
export * from './FastifyHttpServerFactory'
export * from './HttpContext'
export * from './HttpRequest'
export * from './HttpServer'
export * from './types'
export * from './MockinhoHTTP'
export * from '../shared/matchers'
export * from '../shared/matchers/http'

export const mockinhoHTTP = <
  ServerFactory extends HttpServerFactory,
  Config extends Configurations<ServerFactory>
>(
  configurations: ConfigurationsBuilder<ServerFactory, Config>
): MockinhoHTTP<ServerFactory, Config> => new MockinhoHTTP(configurations)

export default mockinhoHTTP
