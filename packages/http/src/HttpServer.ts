import { createServer as createHttpServer, Server as NodeHttpServer } from 'http'
import { Server as NodeHttpsServer, createServer as createHttpsServer } from 'https'
import { AddressInfo } from 'net'
import { Socket } from 'net'
import express, { Express, Request, Response } from 'express'
import { NextFunction } from 'express'
import { Router } from 'express'
import { RequestHandler } from 'express'
import Multer from 'multer'
import Cors from 'cors'
import CookieParse from 'cookie-parser'
import { LoggerUtil } from '@mockinho/core'
import { ErrorCodes } from './types'
import { HttpContext } from './HttpContext'
import { mockFinderMiddleware } from './mockFinderMiddleware'
import { decorateRequestMiddleware } from './decorateRequestMiddleware'
import { HttpRequest } from './HttpRequest'
import { configureProxy } from './configureProxy'
import { Configuration } from './config'
import { logIncomingRequestMiddleware } from './events/logIncomingRequestMiddleware'
import { logReqAndResMiddleware } from './events/logReqAndResMiddleware'
import { rawBodyMiddleware } from './rawBodyMiddleware'

export interface HttpServerInfo {
  useHttp: boolean
  httpPort: number
  httpHost: string

  useHttps: boolean
  httpsPort: number
  httpsHost: string
}

export class HttpServer {
  private readonly configuration: Configuration
  private readonly serverInstances: Array<NodeHttpServer | NodeHttpsServer> = []
  private readonly expressApp: Express
  private readonly sockets: Set<Socket> = new Set<Socket>()
  private readonly httpServer?: NodeHttpServer
  private readonly httpsServer?: NodeHttpsServer

  constructor(private readonly context: HttpContext) {
    this.configuration = context.configuration
    this.expressApp = express()

    if (this.configuration.useHttp) {
      this.httpServer = createHttpServer(this.configuration.httpOptions ?? {}, this.expressApp)
      this.httpServer.setTimeout(this.configuration.timeout)
      this.serverInstances.push(this.httpServer)
    }

    if (this.configuration.useHttps && this.configuration.httpsOptions) {
      this.httpsServer = createHttpsServer(this.configuration.httpsOptions, this.expressApp)
      this.httpsServer.setTimeout(this.configuration.timeout)
      this.serverInstances.push(this.httpsServer)
    }
  }

  preSetup(): void {
    for (const server of this.serverInstances) {
      server.on('connection', socket => {
        this.sockets.add(socket)
        socket.once('close', () => this.sockets.delete(socket))
      })
    }

    this.expressApp.disable('x-powered-by')
    this.expressApp.disable('etag')

    this.expressApp.use(rawBodyMiddleware as Router)
    this.expressApp.use(express.json())
    this.expressApp.use(express.urlencoded(this.configuration.formUrlEncodedOptions))
    this.expressApp.use(express.text())

    this.expressApp.use(logIncomingRequestMiddleware(this.context))
    this.expressApp.use(
      CookieParse(this.configuration.cookieSecrets, this.configuration.cookieOptions)
    )
    this.expressApp.use(Multer(this.configuration.multiPartOptions).any())
    this.expressApp.use(decorateRequestMiddleware as Router)

    this.configuration.preHandlerMiddlewares.forEach(x =>
      x.length === 2
        ? this.expressApp.use(x[0] as string, x[1] as RequestHandler)
        : this.expressApp.use(x[0] as RequestHandler)
    )

    this.expressApp.use(logReqAndResMiddleware(this.context) as Router)
  }

  async start(): Promise<HttpServerInfo> {
    const mockFinder = mockFinderMiddleware(this.context)

    this.expressApp.all('*', (req, res, next) =>
      mockFinder(req as HttpRequest, res, next).catch(err => next(err))
    )

    if (this.configuration.corsEnabled) {
      this.expressApp.use(Cors(this.configuration.corsOptions))
    }

    if (this.configuration.proxyEnabled) {
      configureProxy(this.context, this.expressApp, this.serverInstances)
    }

    this.expressApp.use(
      (error: Error & Record<string, unknown>, req: Request, res: Response, next: NextFunction) => {
        if (error) {
          this.context.emit('exception', error)

          LoggerUtil.instance().error(error)

          return res.status(error.statusCode ? (error.statusCode as number) : 500).send({
            message: error.message,
            code: ErrorCodes.ERR_UNKNOWN_REASON,
            stack: error.stack
          })
        }

        return next()
      }
    )

    const { httpPort, httpHost, httpDynamicPort, httpsPort, httpsHost, httpsDynamicPort } =
      this.configuration

    const info: HttpServerInfo = {
      useHttp: this.configuration.useHttp,
      httpPort: 0,
      httpHost: this.configuration.httpHost,
      useHttps: this.configuration.useHttps,
      httpsPort: 0,
      httpsHost: this.configuration.httpsHost
    }

    if (this.httpServer) {
      const { port } = await new Promise<AddressInfo>(resolve =>
        this.httpServer?.listen(httpDynamicPort ? 0 : httpPort, httpHost, () =>
          resolve(this.httpServer?.address() as AddressInfo)
        )
      )

      info.httpPort = port

      this.httpServer.on('error', (err: Error & Record<string, unknown>) =>
        this.context.emit('exception', err)
      )
    }

    if (this.httpsServer) {
      const { port } = await new Promise<AddressInfo>(resolve =>
        this.httpsServer?.listen(httpsDynamicPort ? 0 : httpsPort, httpsHost, () =>
          resolve(this.httpsServer?.address() as AddressInfo)
        )
      )

      info.httpsPort = port

      this.httpsServer.on('error', (err: Error & Record<string, unknown>) =>
        this.context.emit('exception', err)
      )
    }

    return info
  }

  info(): HttpServerInfo {
    return {
      useHttp: this.configuration.useHttp,
      httpHost: this.configuration.httpHost,
      httpPort: this.httpServer ? (this.httpServer.address() as AddressInfo).port : 0,
      useHttps: this.configuration.useHttps,
      httpsHost: this.configuration.httpsHost,
      httpsPort: this.httpsServer ? (this.httpsServer.address() as AddressInfo).port : 0
    }
  }

  server(): Express {
    return this.expressApp
  }

  async close(): Promise<void> {
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

    await Promise.all(listeners)
  }
}
