import { MockProvider } from '@mockdog/core'
import { HttpServer } from '../srv.js'
import { HttpMockBuilder } from '../builder.js'
import { HttpConfiguration } from '../config/index.js'

export type HttpMockProvider = MockProvider<HttpMockBuilder>

export type HttpMockProviderFactory = (
  configurations: HttpConfiguration,
  server: HttpServer,
) => HttpMockProvider
