import { createServer as createHttpServer, Server as NodeHttpServer } from 'http'
import { createServer as createHttpsServer, Server as NodeHttpsServer } from 'https'
import { AddressInfo, Socket } from 'net'
import CookieParse from 'cookie-parser'
import Cors from 'cors'
import express, { Express, NextFunction, Request, Response, Router } from 'express'
import Multer from 'multer'
import { log, MockServer } from '@mockdog/core'
import { HttpConfiguration, Middleware, MiddlewareRoute } from './config/index.js'
import { bodyParser } from './mid/body_parser.js'
import { configureProxy } from './features/proxy/index.js'
import { decorateRequest } from './mid/decorate_request.js'
import { ErrorCodes } from './_internal/errors.js'
import { logIncomingRequestMiddleware } from './features/hooks/logIncomingRequestMiddleware.js'
import { logReqAndResMiddleware } from './features/hooks/logReqAndResMiddleware.js'
import { HttpContext } from './HttpContext.js'
import { SrvRequest } from './request.js'
import { mockFinderMiddleware } from './mockFinderMiddleware.js'

export interface ConnectionInfo {
  enabled: boolean
  port: number
  host: string
  baseUrl: string
}

export interface HttpServerInfo {
  http: ConnectionInfo
  https: ConnectionInfo
}

export class HttpServer implements MockServer<HttpServerInfo> {
  private readonly configuration: HttpConfiguration
  private readonly serverInstances: Array<NodeHttpServer | NodeHttpsServer> = []
  private readonly expressApp: Express
  private readonly sockets: Set<Socket> = new Set<Socket>()
  private readonly httpServer?: NodeHttpServer
  private readonly httpsServer?: NodeHttpsServer
  private readonly information: HttpServerInfo
  private readonly additionalMiddlewares: Array<MiddlewareRoute> = []

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

    this.information = {
      http: {
        enabled: this.configuration.useHttp,
        port: 0,
        host: this.configuration.httpHost,
        baseUrl: '',
      },

      https: {
        enabled: this.configuration.useHttps,
        port: 0,
        host: this.configuration.httpsHost,
        baseUrl: '',
      },
    }

    this.additionalMiddlewares.push(...this.configuration.middlewares)
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

    this.expressApp.use(decorateRequest as unknown as Router)
    this.expressApp.use(bodyParser(this.configuration.requestBodyParsers) as unknown as Router) // should come before regular body parsers
    this.expressApp.use(express.json())
    this.expressApp.use(express.urlencoded(this.configuration.formUrlEncodedOptions))
    this.expressApp.use(express.text())

    this.expressApp.use(logIncomingRequestMiddleware(this.context))
    this.expressApp.use(
      CookieParse(this.configuration.cookieSecrets, this.configuration.cookieOptions),
    )
    this.expressApp.use(Multer(this.configuration.multiPartOptions).any())
    this.expressApp.use(logReqAndResMiddleware(this.context))
  }

  async start(): Promise<HttpServerInfo> {
    this.additionalMiddlewares.forEach(middleware =>
      this.expressApp.use(middleware.route, middleware.middleware as unknown as Router),
    )

    const mockFinder = mockFinderMiddleware(this.context)

    this.expressApp.all('*', (req, res, next) =>
      mockFinder(req as unknown as SrvRequest, res, next).catch(err => next(err)),
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
          this.context.emit('onError', error)

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
      this.information.http.baseUrl = `http://${this.configuration.httpHost}:${port}`

      this.httpServer.on('error', (err: Error & Record<string, unknown>) =>
        this.context.emit('onError', err),
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
      this.information.https.baseUrl = `http://${this.configuration.httpsHost}:${port}`

      this.httpsServer.on('error', (err: Error & Record<string, unknown>) =>
        this.context.emit('onError', err),
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

  info(): HttpServerInfo {
    return this.information
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
}
