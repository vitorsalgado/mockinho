import { Server as NodeHttpServer } from 'http'
import { Server as NodeHttpsServer } from 'https'
import { HttpContext } from './HttpContext'

export interface HttpServerInfo {
  port: number
}

export interface HttpServer {
  preSetup(): void

  start(): Promise<string>

  close(): Promise<void>

  server(): NodeHttpServer | NodeHttpsServer

  info(): HttpServerInfo
}

export interface HttpServerFactory {
  build(context: HttpContext<any, any>): HttpServer
}
