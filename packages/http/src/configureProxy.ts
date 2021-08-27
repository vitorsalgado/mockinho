import { Server as NodeHttpServer } from 'http'
import { IncomingMessage } from 'http'
import { Server as NodeHttpsServer } from 'https'
import { Options } from 'http-proxy-middleware'
import { responseInterceptor } from 'http-proxy-middleware'
import { createProxyMiddleware } from 'http-proxy-middleware'
import { Express } from 'express'
import { LoggerUtil } from '@mockinho/core'
import { RecordDispatcher } from './rec/RecordDispatcher'
import { HttpRequest } from './HttpRequest'
import { HttpContext } from './HttpContext'
import { MediaTypes } from './types'

export function configureProxy(
  context: HttpContext,
  expressApp: Express,
  serverInstances: Array<NodeHttpServer | NodeHttpsServer>
): void {
  let opts: Options = context.configuration.proxyOptions

  if (context.configuration.isRecordEnabled) {
    const dispatcher = new RecordDispatcher(context)

    for (const server of serverInstances) {
      server.on('close', () =>
        dispatcher
          .terminate()
          .finally(() => LoggerUtil.instance().debug('Recorder Dispatcher Terminated'))
      )
    }

    opts = {
      ...context.configuration.proxyOptions,

      selfHandleResponse: true,
      logLevel: opts.logLevel ?? 'silent',
      timeout: opts.timeout ?? 30 * 1000,
      proxyTimeout: opts.proxyTimeout ?? 30 * 1000,

      onProxyReq(proxyReq, request: IncomingMessage) {
        ;(request as IncomingMessage & Record<string, unknown>).proxied = true
        ;(request as IncomingMessage & Record<string, unknown>).target =
          context.configuration.proxyOptions.target
      },

      onError:
        opts.onError ??
        ((error, req, res) => {
          context.emit('exception', error)

          res.writeHead(500, { 'Content-Type': MediaTypes.TEXT_PLAIN })
          res.end('Proxy Error: ' + error.message)
        }),

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
