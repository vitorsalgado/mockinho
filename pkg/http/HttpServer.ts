import { Server } from 'http'
import { HttpContext } from './HttpContext'

export interface HttpServerInfo {
  port: number
}

export interface HttpServer {
  preSetup(): void

  start(): Promise<string>

  close(): Promise<void>

  server(): Server

  info(): HttpServerInfo
}

export interface HttpServerFactory {
  build(context: HttpContext<any, any>): HttpServer
}
