import { MockProvider } from '@mockdog/core'
import { HttpServer } from '../../HttpServer'
import { HttpMockBuilder } from '..'
import { HttpConfiguration } from '../../config'

export type HttpMockProvider = MockProvider<HttpMockBuilder>

export type HttpMockProviderFactory = (
  configurations: HttpConfiguration,
  server: HttpServer
) => HttpMockProvider
