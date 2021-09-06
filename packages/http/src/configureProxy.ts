import { Server as NodeHttpServer } from 'http'
import { IncomingMessage } from 'http'
import { ClientRequest } from 'http'
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
import { Headers } from './types'

export function configureProxy(
  context: HttpContext,
  expressApp: Express,
  serverInstances: Array<NodeHttpServer | NodeHttpsServer>
): void {
  let opts: Options = context.configuration.proxyOptions

  opts = {
    ...context.configuration.proxyOptions,

    logLevel: 'silent',
    timeout: opts.timeout ?? 30 * 1000,
    proxyTimeout: opts.proxyTimeout ?? 30 * 1000,

    onProxyReq: function (proxyReq, request: HttpRequest) {
      request.proxied = true
      request.target = context.configuration.proxyOptions.target

      if (request.rawBody) {
        proxyReq.setHeader(Headers.ContentLength, Buffer.byteLength(request.rawBody))
        proxyReq.write(request.rawBody)
      }

      // if (request.body) {
      //   const body = Buffer.from(request.body)
      //
      //   proxyReq.setHeader(Headers.ContentLength, Buffer.byteLength())
      //   proxyReq.write(request.body)
      // }
    } as (proxyReq: ClientRequest, request: IncomingMessage) => void,

    onError:
      opts.onError ??
      ((error, req, res) => {
        context.emit('exception', error)

        res.writeHead(500, { 'content-type': MediaTypes.TEXT_PLAIN })
        res.end('Proxy Error: ' + error.message)
      })
  }

  if (context.configuration.recordEnabled) {
    const dispatcher = new RecordDispatcher(context)

    for (const server of serverInstances) {
      server.on('close', () =>
        dispatcher
          .terminate()
          .finally(() => LoggerUtil.instance().debug('Recorder Dispatcher Terminated'))
      )
    }

    opts.selfHandleResponse = true
    opts.onProxyRes = responseInterceptor(async (responseBuffer, proxyRes, req, res) => {
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

  expressApp.use('*', createProxyMiddleware(opts))
}
