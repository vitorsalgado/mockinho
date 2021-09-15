import { HttpServer } from '../../HttpServer'
import { HttpMockBuilder } from '..'
import { Configuration } from '../../config'

export type MockProvider = () => Promise<Array<HttpMockBuilder>>

export type MockProviderFactory = (
  configurations: Configuration,
  server: HttpServer
) => MockProvider
