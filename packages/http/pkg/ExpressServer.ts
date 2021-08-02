import { createServer as createHttpServer, Server as NodeHttpServer } from 'http'
import { Server as NodeHttpsServer, createServer as createHttpsServer } from 'https'
import { AddressInfo } from 'net'
import express, { Express, Request, Response, NextFunction } from 'express'
import Multer from 'multer'
import Cors from 'cors'
import { LoggerUtil } from '@mockinho/core'
import { ExpressConfigurations } from './config'
import { HttpServer, HttpServerInfo } from './HttpServer'
import { StubNotFoundError } from './StubNotFoundError'
import { ErrorCodes } from './types'
import { HttpContext } from './HttpContext'
import { ExpressServerFactory } from './ExpressServerFactory'
import { findStubMiddleware } from './findStubMiddleware'

export class ExpressServer implements HttpServer {
  private readonly configurations: ExpressConfigurations
  private readonly serverInstance: NodeHttpServer | NodeHttpsServer
  private readonly expressApp: Express

  constructor(private readonly context: HttpContext<ExpressServerFactory, ExpressConfigurations>) {
    this.configurations = context.provideConfigurations()
    this.expressApp = express()
    this.serverInstance =
      this.configurations.https && this.configurations.httpsOptions
        ? createHttpsServer(this.configurations.httpsOptions, this.expressApp)
        : createHttpServer(this.expressApp)
  }

  preSetup(): void {
    const handler = findStubMiddleware(this.context)

    this.serverInstance.setTimeout(3_600_000)

    this.expressApp.disable('x-powered-by')
    this.expressApp.disable('etag')

    this.expressApp.use(express.json())
    this.expressApp.use(express.urlencoded(this.configurations.formUrlEncodedOptions))
    this.expressApp.use(express.text())
    this.expressApp.use(Multer(this.configurations.multiPartOptions).any())

    this.expressApp.all('*', async (req, res, next) => {
      return handler(req, res, next).catch(err => next(err))
    })

    if (this.configurations.cors) {
      this.expressApp.use(Cors(this.configurations.corsOptions))
    }

    this.expressApp.use(function (
      error: Error | StubNotFoundError | any,
      req: Request,
      res: Response,
      next: NextFunction
    ) {
      if (!error) {
        return next()
      }

      LoggerUtil.instance().error(error)

      if (error instanceof StubNotFoundError) {
        res
          .status(error.statusCode)
          .send({ message: error.message, code: error.code, closestMatches: error.closesMatches })
      }

      res
        .status(error.statusCode ?? 500)
        .send({ message: error.message, code: ErrorCodes.MR_ERR, stack: error.stack })
    })

    process.on('SIGTERM', () => this.serverInstance.close())
    process.on('SIGKILL', () => this.serverInstance.close())
    process.on('SIGUSR2', () => this.serverInstance.close())
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
    return new Promise<void>(resolve => this.serverInstance.close(() => resolve()))
  }
}
