import { ConfigurationsBuilder } from './config'
import { MockinhoHTTP } from './MockinhoHTTP'
import { DefaultServerFactory } from './types'
import { DefaultConfigurations } from './types'

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

export const mockinhoHTTP = (
  configurations: ConfigurationsBuilder<DefaultServerFactory, DefaultConfigurations>
): MockinhoHTTP => new MockinhoHTTP(configurations)

export default mockinhoHTTP
