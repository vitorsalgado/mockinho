import { Server as NodeHttpServer } from 'http'
import { IncomingMessage } from 'http'
import { ClientRequest } from 'http'
import { ServerResponse } from 'http'
import { Server as NodeHttpsServer } from 'https'
import { Options } from 'http-proxy-middleware'
import { responseInterceptor } from 'http-proxy-middleware'
import { createProxyMiddleware } from 'http-proxy-middleware'
import { log } from '@mockdog/core'
import { modeIsAtLeast } from '@mockdog/core'
import { H, Media } from '../../http.js'
import type { MockDogHttp } from '../../MockDogHttp.js'
import { RecordDispatcher } from '../rec/index.js'
import { SrvRequest } from '../../request.js'

export function configureProxy(
  app: MockDogHttp,
  serverInstances: Array<NodeHttpServer | NodeHttpsServer>,
): void {
  if (!app.config.proxyOptions.target) {
    throw new Error('Proxy target must not be empty or undefined.')
  }

  const conf = app.config
  let opts: Options = conf.proxyOptions

  opts = {
    ...conf.proxyOptions,

    logLevel: 'silent',
    timeout: opts.timeout ?? 30 * 1000,
    proxyTimeout: opts.proxyTimeout ?? 30 * 1000,

    onProxyReq: function (proxyReq, request: SrvRequest) {
      const target = String(conf.proxyOptions.target)

      app.hooks.emit('onProxyRequest', { target })

      request.$internals.proxy = true
      request.$internals.proxyTarget = target

      if (request.$internals.rawBody) {
        proxyReq.setHeader(H.ContentLength, Buffer.byteLength(request.$internals.rawBody))
        proxyReq.write(request.$internals.rawBody)
      }
    } as (proxyReq: ClientRequest, request: IncomingMessage) => void,

    onProxyRes: function (proxyRes, req, res) {
      onProxyResponse(req as unknown as SrvRequest, res)
    },

    onError:
      opts.onError ??
      ((error, req, res) => {
        app.hooks.emit('onError', error)

        res.writeHead(500, { 'content-type': Media.PlainText })
        res.end('Proxy Error: ' + error.message)
      }),
  }

  if (conf.recordEnabled) {
    const dispatcher = new RecordDispatcher(app)

    for (const server of serverInstances) {
      server.on('close', () =>
        dispatcher.terminate().finally(() => log.debug('Recorder Dispatcher Terminated')),
      )
    }

    dispatcher.init()

    opts.selfHandleResponse = true
    opts.onProxyRes = responseInterceptor(async (responseBuffer, proxyRes, req, res) => {
      const request = req as SrvRequest

      dispatcher.record({
        request: {
          id: request.$internals.id,
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

      onProxyResponse(request, res)

      return responseBuffer
    })
  }

  app.server.instance.use('*', createProxyMiddleware(opts))
}

function onProxyResponse(request: SrvRequest, response: ServerResponse): void {
  request.$ctx.hooks.emit('onProxyResponse', {
    verbose: modeIsAtLeast(request.$ctx.config, 'verbose'),
    start: request.$internals.start,
    method: request.method,
    url: request.url,
    path: request.path,
    response: {
      status: response.statusCode,
      headers: response.getHeaders() as Record<string, string>,
    },
  })
}
