import { Server as NodeHttpServer } from 'http'
import { IncomingMessage } from 'http'
import { ClientRequest } from 'http'
import { ServerResponse } from 'http'
import { Server as NodeHttpsServer } from 'https'
import { Options } from 'http-proxy-middleware'
import { responseInterceptor } from 'http-proxy-middleware'
import { createProxyMiddleware } from 'http-proxy-middleware'
import { Express } from 'express'
import { LoggerUtil } from '@mockdog/core'
import { modeIsAtLeast } from '@mockdog/core'
import { RecordDispatcher } from './record/index.js'
import { HttpRequest } from './HttpRequest.js'
import { HttpContext } from './HttpContext.js'
import { MediaTypes } from './MediaTypes.js'
import { Headers } from './Headers.js'

export function configureProxy(
  context: HttpContext,
  expressApp: Express,
  serverInstances: Array<NodeHttpServer | NodeHttpsServer>,
): void {
  if (!context.configuration.proxyOptions.target) {
    throw new Error('Proxy target must not be empty or undefined.')
  }

  let opts: Options = context.configuration.proxyOptions

  opts = {
    ...context.configuration.proxyOptions,

    logLevel: 'silent',
    timeout: opts.timeout ?? 30 * 1000,
    proxyTimeout: opts.proxyTimeout ?? 30 * 1000,

    onProxyReq: function (proxyReq, request: HttpRequest) {
      const target = String(context.configuration.proxyOptions.target)

      context.emit('onProxyRequest', { target })

      request.proxied = true
      request.target = target

      if (request.rawBody) {
        proxyReq.setHeader(Headers.ContentLength, Buffer.byteLength(request.rawBody))
        proxyReq.write(request.rawBody)
      }
    } as (proxyReq: ClientRequest, request: IncomingMessage) => void,

    onProxyRes: function (proxyRes, req, res) {
      onProxyResponse(context, req as HttpRequest, res)
    },

    onError:
      opts.onError ??
      ((error, req, res) => {
        context.emit('onError', error)

        res.writeHead(500, { 'content-type': MediaTypes.TEXT_PLAIN })
        res.end('Proxy Error: ' + error.message)
      }),
  }

  if (context.configuration.recordEnabled) {
    const dispatcher = new RecordDispatcher(context)

    for (const server of serverInstances) {
      server.on('close', () =>
        dispatcher
          .terminate()
          .finally(() => LoggerUtil.instance().debug('Recorder Dispatcher Terminated')),
      )
    }

    dispatcher.init()

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
          body: request.body,
        },
        response: {
          status: res.statusCode,
          headers: res.getHeaders() as Record<string, string>,
          body: responseBuffer,
        },
      })

      onProxyResponse(context, request, res)

      return responseBuffer
    })
  }

  expressApp.use('*', createProxyMiddleware(opts))
}

function onProxyResponse(
  context: HttpContext,
  request: HttpRequest,
  response: ServerResponse,
): void {
  context.emit('onProxyResponse', {
    verbose: modeIsAtLeast(context.configuration, 'verbose'),
    start: request.start,
    method: request.method,
    url: request.url,
    path: request.path,
    response: {
      status: response.statusCode,
      headers: response.getHeaders() as Record<string, string>,
    },
  })
}
