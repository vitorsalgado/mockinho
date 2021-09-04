import { HttpServer } from '../../HttpServer'
import { HttpMockBuilder } from '..'

export type MockProvider = () => Promise<Array<HttpMockBuilder>>

export type MockProviderFactory<Config> = (
  configurations: Config,
  server: HttpServer
) => MockProvider
