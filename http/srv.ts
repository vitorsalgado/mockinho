import { createServer as createHttpServer, Server as NodeHttpServer } from 'http'
import { createServer as createHttpsServer, Server as NodeHttpsServer } from 'https'
import { AddressInfo, Socket } from 'net'
import CookieParse from 'cookie-parser'
import Cors from 'cors'
import express, { Express, NextFunction, Request, Response, Router } from 'express'
import Multer from 'multer'
import { log, Server } from '@mockdog/core'
import { HttpConfiguration, Middleware, MiddlewareRoute } from './config/index.js'
import { bodyParser } from './feat/bodyparsers/body_parser.js'
import { configureProxy } from './feat/proxy/index.js'
import { decorateRequest } from './decorateRequest.js'
import { ErrorCodes } from './_internal/errors.js'
import { logIncomingRequestMiddleware } from './feat/hooks/logIncomingRequestMiddleware.js'
import { logReqAndResMiddleware } from './feat/hooks/logReqAndResMiddleware.js'
import { SrvRequest } from './request.js'
import { mockFinderMiddleware } from './mockFinderMiddleware.js'
import type { MockDogHttp } from './MockDogHttp.js'

export interface ConnectionInfo {
  enabled: boolean
  port: number
  host: string
  url: string
}

export interface HttpServerInfo {
  http: ConnectionInfo
  https: ConnectionInfo
}

export class HttpServer implements Server<HttpServerInfo, Express> {
  private readonly configuration: HttpConfiguration
  private readonly serverInstances: Array<NodeHttpServer | NodeHttpsServer> = []
  private readonly expressApp: Express
  private readonly sockets: Set<Socket> = new Set<Socket>()
  private readonly httpServer?: NodeHttpServer
  private readonly httpsServer?: NodeHttpsServer
  private readonly information: HttpServerInfo
  private readonly additionalMiddlewares: Array<MiddlewareRoute> = []

  constructor(private readonly app: MockDogHttp) {
    this.configuration = app.config
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

    this.information = {
      http: {
        enabled: this.configuration.useHttp,
        port: 0,
        host: this.configuration.httpHost,
        url: '',
      },

      https: {
        enabled: this.configuration.useHttps,
        port: 0,
        host: this.configuration.httpsHost,
        url: '',
      },
    }

    this.additionalMiddlewares.push(...this.configuration.middlewares)
  }

  get info(): HttpServerInfo {
    return this.information
  }

  get instance(): Express {
    return this.expressApp
  }

  setup(): void {
    for (const server of this.serverInstances) {
      server.on('connection', (socket: Socket) => {
        this.sockets.add(socket)
        socket.once('close', () => this.sockets.delete(socket))
      })
    }

    this.expressApp.disable('x-powered-by')
    this.expressApp.disable('etag')

    this.expressApp.set('query parser', (query: string) => new URLSearchParams(query))

    this.mid(decorateRequest(this.app))
    this.mid(bodyParser(this.configuration.requestBodyParsers)) // should come before regular body parsers
    this.mid(express.json())
    this.mid(express.urlencoded(this.configuration.formUrlEncodedOptions))
    this.mid(express.text())

    this.mid(logIncomingRequestMiddleware)
    this.expressApp.use(
      CookieParse(this.configuration.cookieSecrets, this.configuration.cookieOptions),
    )
    this.expressApp.use(Multer(this.configuration.multiPartOptions).any())
    this.mid(logReqAndResMiddleware)
  }

  async start(): Promise<HttpServerInfo> {
    this.additionalMiddlewares.forEach(middleware =>
      this.expressApp.use(middleware.route, middleware.middleware as unknown as Router),
    )

    const mockFinder = mockFinderMiddleware(this.app)

    this.expressApp.all('*', (req, res, next) =>
      mockFinder(req as unknown as SrvRequest, res, next).catch(err => next(err)),
    )

    if (this.configuration.corsEnabled) {
      this.expressApp.use(Cors(this.configuration.corsOptions))
    }

    if (this.configuration.proxyEnabled) {
      configureProxy(this.app, this.serverInstances)
    }

    this.expressApp.use(
      (error: Error & Record<string, unknown>, req: Request, res: Response, next: NextFunction) => {
        if (error) {
          this.app.hooks.emit('onError', error)

          log.error(error)

          return res.status(error.statusCode ? (error.statusCode as number) : 500).send({
            message: error.message,
            code: ErrorCodes.ERR_UNKNOWN_REASON,
            stack: error.stack,
          })
        }

        return next()
      },
    )

    const { httpPort, httpHost, httpDynamicPort, httpsPort, httpsHost, httpsDynamicPort } =
      this.configuration

    if (this.httpServer) {
      const { port } = await new Promise<AddressInfo>(resolve => {
        if (this.httpServer)
          this.httpServer.listen(httpDynamicPort ? 0 : httpPort, httpHost, () =>
            resolve(this.httpServer?.address() as AddressInfo),
          )
      })

      this.information.http.port = port
      this.information.http.host = this.configuration.httpHost
      this.information.http.url = `http://${this.configuration.httpHost}:${port}`

      this.httpServer.on('error', (err: Error & Record<string, unknown>) =>
        this.app.hooks.emit('onError', err),
      )
    }

    if (this.httpsServer) {
      const { port } = await new Promise<AddressInfo>(resolve => {
        if (this.httpsServer)
          this.httpsServer.listen(httpsDynamicPort ? 0 : httpsPort, httpsHost, () => {
            if (this.httpsServer) resolve(this.httpsServer.address() as AddressInfo)
          })
      })

      this.information.https.port = port
      this.information.https.host = this.configuration.httpsHost
      this.information.https.url = `http://${this.configuration.httpsHost}:${port}`

      this.httpsServer.on('error', (err: Error & Record<string, unknown>) =>
        this.app.hooks.emit('onError', err),
      )
    }

    return this.information
  }

  use(route: string | Middleware, middleware?: Middleware): void {
    if (typeof route === 'string') {
      if (!middleware) {
        throw new Error('A second parameter middleware is required when a route is provided.')
      }

      this.additionalMiddlewares.push({ route, middleware })
    } else {
      this.additionalMiddlewares.push({ route: '*', middleware: route })
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
      listeners.push(
        new Promise<void>(resolve => {
          if (this.httpsServer) this.httpsServer.close(() => resolve())
        }),
      )
    }

    await Promise.all(listeners)
  }

  private mid(
    mid: (req: SrvRequest, res: Response, next: NextFunction) => Promise<void> | void,
  ): void {
    this.expressApp.use(mid as unknown as Router)
  }
}
