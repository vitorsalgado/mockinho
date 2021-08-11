import { createServer as createHttpServer, Server as NodeHttpServer } from 'http'
import { Server as NodeHttpsServer, createServer as createHttpsServer } from 'https'
import { AddressInfo } from 'net'
import { Socket } from 'net'
import express, { Express, Request, Response } from 'express'
import { NextFunction } from 'express'
import { Router } from 'express'
import Multer from 'multer'
import Cors from 'cors'
import CookieParse from 'cookie-parser'
import { createProxyMiddleware } from 'http-proxy-middleware'
import { responseInterceptor } from 'http-proxy-middleware'
import { Options } from 'http-proxy-middleware'
import { LoggerUtil } from '@mockinho/core'
import { ExpressConfigurations } from './config'
import { HttpServer, HttpServerInfo } from './HttpServer'
import { ErrorCodes } from './types'
import { HttpContext } from './HttpContext'
import { stubFinderMiddleware } from './stubFinderMiddleware'
import { RecordDispatcher } from './rec/RecordDispatcher'
import { decorateRequestMiddleware } from './decorateRequestMiddleware'
import { HttpRequest } from './HttpRequest'

export class ExpressServer implements HttpServer<Express> {
  private readonly configurations: ExpressConfigurations
  private readonly serverInstances: Array<NodeHttpServer | NodeHttpsServer> = []
  private readonly expressApp: Express
  private readonly sockets: Set<Socket> = new Set<Socket>()
  private readonly httpServer?: NodeHttpServer
  private readonly httpsServer?: NodeHttpsServer

  constructor(private readonly context: HttpContext) {
    this.configurations = context.provideConfigurations()
    this.expressApp = express()

    if (this.configurations.useHttp) {
      this.httpServer = createHttpServer(this.configurations.httpOptions ?? {}, this.expressApp)
      this.httpServer.setTimeout(this.configurations.timeout)
      this.serverInstances.push(this.httpServer)
    }

    if (this.configurations.useHttps && this.configurations.httpsOptions) {
      this.httpsServer = createHttpsServer(this.configurations.httpsOptions, this.expressApp)
      this.httpsServer.setTimeout(this.configurations.timeout)
      this.serverInstances.push(this.httpsServer)
    }
  }

  preSetup(): void {
    process.on('SIGTERM', () => this.close())
    process.on('SIGINT', () => this.close())

    for (const server of this.serverInstances) {
      server.on('connection', socket => {
        this.sockets.add(socket)
        socket.once('close', () => this.sockets.delete(socket))
      })
    }

    const stubFinderHandler = stubFinderMiddleware(this.context)

    this.expressApp.disable('x-powered-by')
    this.expressApp.disable('etag')

    this.expressApp.use(express.json())
    this.expressApp.use(express.urlencoded(this.configurations.formUrlEncodedOptions))
    this.expressApp.use(express.text())
    this.expressApp.use(
      CookieParse(this.configurations.cookieSecrets, this.configurations.cookieOptions)
    )
    this.expressApp.use(Multer(this.configurations.multiPartOptions).any())

    this.expressApp.use(decorateRequestMiddleware as Router)
    this.configurations.preHandlerMiddlewares.forEach(x => this.expressApp.use(x))
    this.expressApp.all('*', async (req, res, next) => {
      return stubFinderHandler(req as HttpRequest, res, next).catch(err => next(err))
    })

    if (this.configurations.isCorsEnabled) {
      this.expressApp.use(Cors(this.configurations.corsOptions))
    }

    if (this.configurations.isProxyEnabled) {
      let opts: Options = this.configurations.proxyOptions

      if (this.configurations.isRecordEnabled) {
        const dispatcher = new RecordDispatcher(this.configurations)

        for (const server of this.serverInstances) {
          server.on('close', () =>
            dispatcher
              .terminate()
              .finally(() => LoggerUtil.instance().debug('Recorder Dispatcher Terminated'))
          )
        }

        opts = {
          ...this.configurations.proxyOptions,

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

      this.expressApp.use('*', createProxyMiddleware(opts))
    }

    this.expressApp.use(function (error: Error, req: Request, res: Response, next: NextFunction) {
      if (error) {
        LoggerUtil.instance().error(error)

        return res
          .status((error as any).statusCode ?? 500)
          .send({ message: error.message, code: ErrorCodes.MR_ERR, stack: error.stack })
      }

      return next()
    })
  }

  async start(): Promise<HttpServerInfo> {
    const { httpPort, httpHost, httpDynamicPort, httpsPort, httpsHost, httpsDynamicPort } =
      this.configurations

    const info: HttpServerInfo = {
      useHttp: this.configurations.useHttp,
      httpPort: 0,
      httpHost: this.configurations.httpHost,
      useHttps: this.configurations.useHttps,
      httpsPort: 0,
      httpsHost: this.configurations.httpsHost
    }

    if (this.httpServer) {
      const { port } = await new Promise<AddressInfo>(resolve =>
        this.httpServer?.listen(httpDynamicPort ? 0 : httpPort, httpHost, () =>
          resolve(this.httpServer?.address() as AddressInfo)
        )
      )

      info.httpPort = port
    }

    if (this.httpsServer) {
      const { port } = await new Promise<AddressInfo>(resolve =>
        this.httpsServer?.listen(httpsDynamicPort ? 0 : httpsPort, httpsHost, () =>
          resolve(this.httpsServer?.address() as AddressInfo)
        )
      )

      info.httpsPort = port
    }

    return info
  }

  info(): HttpServerInfo {
    return {
      useHttp: this.configurations.useHttp,
      httpHost: this.configurations.httpHost,
      httpPort: this.httpServer ? (this.httpServer.address() as AddressInfo).port : 0,
      useHttps: this.configurations.useHttps,
      httpsHost: this.configurations.httpsHost,
      httpsPort: this.httpsServer ? (this.httpsServer.address() as AddressInfo).port : 0
    }
  }

  server(): Express {
    return this.expressApp
  }

  close(): Promise<void> {
    for (const socket of this.sockets) {
      socket.destroy()
      this.sockets.delete(socket)
    }

    const listeners: Array<Promise<void>> = []

    if (this.httpServer) {
      listeners.push(new Promise<void>(resolve => this.httpServer?.close(() => resolve())))
    }

    if (this.httpsServer) {
      listeners.push(new Promise<void>(resolve => this.httpsServer?.close(() => resolve())))
    }

    return Promise.all(listeners).then()
  }
}
