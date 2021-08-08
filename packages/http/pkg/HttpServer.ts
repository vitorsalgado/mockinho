import { HttpContext } from './HttpContext'

export interface HttpServerInfo {
  useHttp: boolean
  httpPort: number
  httpHost: string

  useHttps: boolean
  httpsPort: number
  httpsHost: string
}

export interface HttpServer<Listener = any> {
  preSetup(): void

  start(): Promise<HttpServerInfo>

  close(): Promise<void>

  server(): Listener

  info(): HttpServerInfo
}

export interface HttpServerFactory<Listener = any> {
  build(context: HttpContext<any>): HttpServer<Listener>
}
