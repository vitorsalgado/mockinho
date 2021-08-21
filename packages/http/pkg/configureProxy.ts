import { Server as NodeHttpServer } from 'http'
import { Server as NodeHttpsServer } from 'https'
import { Options } from 'http-proxy-middleware'
import { responseInterceptor } from 'http-proxy-middleware'
import { createProxyMiddleware } from 'http-proxy-middleware'
import { Express } from 'express'
import { LoggerUtil } from '@mockinho/core'
import { RecordDispatcher } from './rec/RecordDispatcher'
import { ExpressConfigurations } from './config'

export function configureProxy(
  configurations: ExpressConfigurations,
  expressApp: Express,
  serverInstances: Array<NodeHttpServer | NodeHttpsServer>
): void {
  let opts: Options = configurations.proxyOptions

  if (configurations.isRecordEnabled) {
    const dispatcher = new RecordDispatcher(configurations)

    for (const server of serverInstances) {
      server.on('close', () =>
        dispatcher
          .terminate()
          .finally(() => LoggerUtil.instance().debug('Recorder Dispatcher Terminated'))
      )
    }

    opts = {
      ...configurations.proxyOptions,

      selfHandleResponse: true,

      onProxyRes: responseInterceptor(async (responseBuffer, proxyRes, req: any, res) => {
        dispatcher.record({
          request: {
            id: req.id,
            url: req.url,
            path: req.path,
            method: req.method,
            headers: req.headers,
            query: req.query,
            body: req.body
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
