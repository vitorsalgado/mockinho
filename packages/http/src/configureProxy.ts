import { Server as NodeHttpServer } from 'http'
import { Server as NodeHttpsServer } from 'https'
import { Options } from 'http-proxy-middleware'
import { responseInterceptor } from 'http-proxy-middleware'
import { createProxyMiddleware } from 'http-proxy-middleware'
import { Express } from 'express'
import { LoggerUtil } from '@mockinho/core'
import { RecordDispatcher } from './rec/RecordDispatcher'
import { HttpRequest } from './HttpRequest'
import { HttpConfiguration } from './config'

export function configureProxy(
  configuration: HttpConfiguration,
  expressApp: Express,
  serverInstances: Array<NodeHttpServer | NodeHttpsServer>
): void {
  let opts: Options = configuration.proxyOptions

  if (configuration.isRecordEnabled) {
    const dispatcher = new RecordDispatcher(configuration)

    for (const server of serverInstances) {
      server.on('close', () =>
        dispatcher
          .terminate()
          .finally(() => LoggerUtil.instance().debug('Recorder Dispatcher Terminated'))
      )
    }

    opts = {
      ...configuration.proxyOptions,

      selfHandleResponse: true,

      onProxyRes: responseInterceptor(async (responseBuffer, proxyRes, req, res) => {
        const request = req as HttpRequest

        dispatcher.record({
          request: {
            id: request.id,
            url: request.url,
            path: request.path,
            method: request.method,
            headers: request.headers,
            query: request.query,
            body: request.body
          },
          response: {
            status: res.statusCode,
            headers: res.getHeaders() as Record<string, string>,
            body: responseBuffer
          }
        })

        return responseBuffer
      })
    }
  }

  expressApp.use('*', createProxyMiddleware(opts))
}
