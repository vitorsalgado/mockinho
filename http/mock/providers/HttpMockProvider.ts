import { MockProvider } from '@mockdog/core'
import { HttpServer } from '../../HttpServer.js'
import { HttpMockBuilder } from '../HttpMockBuilder.js'
import { HttpConfiguration } from '../../config/index.js'

export type HttpMockProvider = MockProvider<HttpMockBuilder>

export type HttpMockProviderFactory = (
  configurations: HttpConfiguration,
  server: HttpServer,
) => HttpMockProvider
