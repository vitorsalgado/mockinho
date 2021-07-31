import { Configurations, ConfigurationsBuilder } from './config'
import { HttpServerFactory } from './HttpServer'
import { MockrushHTTP } from './MockrushHTTP'

export * from './config'
export * from './stub'
export * from './eventlisteners'
export * from './FastifyHttpServer'
export * from './FastifyHttpServerFactory'
export * from './HttpContext'
export * from './HttpRequest'
export * from './HttpServer'
export * from './types'
export * from './MockrushHTTP'
export * from '../shared/matchers'
export * from '../shared/matchers/http'

export const mockrushHTTP = <
  ServerFactory extends HttpServerFactory,
  Config extends Configurations<ServerFactory>
>(
  configurations: ConfigurationsBuilder<ServerFactory, Config>
): MockrushHTTP<ServerFactory, Config> => new MockrushHTTP(configurations)

export default mockrushHTTP
