import { createServer as createHttpServer, Server as NodeHttpServer } from 'http'
import { Server as NodeHttpsServer, createServer as createHttpsServer } from 'https'
import { AddressInfo } from 'net'
import { Socket } from 'net'
import express, { Express, Request, Response } from 'express'
import Multer from 'multer'
import Cors from 'cors'
import CookieParse from 'cookie-parser'
import { LoggerUtil } from '@mockinho/core'
import { FindStubResult } from '@mockinho/core'
import { ExpressConfigurations } from './config'
import { HttpServer, HttpServerInfo } from './HttpServer'
import { ErrorCodes } from './types'
import { MediaTypes } from './types'
import { Headers } from './types'
import { HttpContext } from './HttpContext'
import { stubFinderMiddleware } from './stubFinderMiddleware'
import { HttpRequest } from './HttpRequest'
import { HttpResponseDefinition } from './stub'
import { HttpResponseDefinitionBuilder } from './stub'

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
    process.on('SIGTERM', () => this.serverInstance.close())
    process.on('SIGKILL', () => this.serverInstance.close())
    process.on('SIGUSR2', () => this.serverInstance.close())

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

    if (this.configurations.cors) {
      this.expressApp.use(Cors(this.configurations.corsOptions))
    }

    this.expressApp.use(function (
      params:
        | Error
        | FindStubResult<
            HttpContext,
            HttpRequest,
            HttpResponseDefinition,
            HttpResponseDefinitionBuilder
          >
        | any,
      req: Request,
      res: Response
    ) {
      if (params instanceof FindStubResult) {
        if (params.hasMatch()) {
          throw new Error('Should not be here when there is a match!')
        }

        return res
          .set(Headers.ContentType, MediaTypes.TEXT_PLAIN)
          .status(500)
          .send(
            `Request was not matched.${params
              .closestMatch()
              .map(() => ' See closest matches below:')
              .orNothing()}\n` +
              params
                .closestMatch()
                .map(x => [{ id: x.id, name: x.name, filename: x.sourceDescription }])
                .orValue([])
                .map(item => `Name: ${item.name}\nId: ${item.id}\nFile: ${item.filename}\n`)
          )
      }

      LoggerUtil.instance().error(params)

      return res
        .status(params.statusCode ?? 500)
        .send({ message: params.message, code: ErrorCodes.MR_ERR, stack: params.stack })
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
