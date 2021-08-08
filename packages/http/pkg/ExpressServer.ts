import { createServer as createHttpServer, Server as NodeHttpServer } from 'http'
import { Server as NodeHttpsServer, createServer as createHttpsServer } from 'https'
import { AddressInfo } from 'net'
import { Socket } from 'net'
import express, { Express, Request, Response } from 'express'
import { NextFunction } from 'express'
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

export class ExpressServer implements HttpServer {
  private readonly configurations: ExpressConfigurations
  private readonly serverInstance: NodeHttpServer | NodeHttpsServer
  private readonly expressApp: Express
  private readonly sockets: Set<Socket> = new Set<Socket>()

  constructor(private readonly context: HttpContext) {
    this.configurations = context.provideConfigurations()
    this.expressApp = express()
    this.serverInstance =
      this.configurations.https && this.configurations.httpsOptions
        ? createHttpsServer(this.configurations.httpsOptions, this.expressApp)
        : createHttpServer(this.expressApp)
  }

  preSetup(): void {
    process.on('SIGTERM', () => this.close())
    process.on('SIGINT', () => this.close())

    const handler = stubFinderMiddleware(this.context)

    this.serverInstance.setTimeout(3_600_000)
    this.serverInstance.on('connection', socket => {
      this.sockets.add(socket)
      socket.once('close', () => this.sockets.delete(socket))
    })

    this.expressApp.disable('x-powered-by')
    this.expressApp.disable('etag')

    this.expressApp.use(express.json())
    this.expressApp.use(express.urlencoded(this.configurations.formUrlEncodedOptions))
    this.expressApp.use(express.text())
    this.expressApp.use(
      CookieParse(this.configurations.cookieSecrets, this.configurations.cookieOptions)
    )
    this.expressApp.use(Multer(this.configurations.multiPartOptions).any())

    this.expressApp.all('*', async (req, res, next) => {
      return handler(req, res, next).catch(err => next(err))
    })

    if (this.configurations.isCorsEnabled) {
      this.expressApp.use(Cors(this.configurations.corsOptions))
    }

    if (this.configurations.isProxyEnabled) {
      let opts: Options = this.configurations.proxyOptions

      if (this.configurations.isRecordEnabled) {
        const dispatcher = new RecordDispatcher(this.configurations)

        this.serverInstance.on('close', () =>
          dispatcher
            .terminate()
            .finally(() => LoggerUtil.instance().debug('Recorder Dispatcher Terminated'))
        )

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

  start(): Promise<string> {
    const { port, host } = this.configurations

    return new Promise<string>(resolve =>
      this.serverInstance.listen(this.configurations.dynamicPort ? 0 : port, host, () =>
        resolve(String((this.server().address() as AddressInfo).port))
      )
    )
  }

  info(): HttpServerInfo {
    return {
      port: (this.server().address() as AddressInfo).port
    }
  }

  server(): NodeHttpServer | NodeHttpsServer {
    return this.serverInstance
  }

  close(): Promise<void> {
    for (const socket of this.sockets) {
      socket.destroy()
      this.sockets.delete(socket)
    }

    return new Promise<void>(resolve => this.serverInstance.close(() => resolve()))
  }
}
