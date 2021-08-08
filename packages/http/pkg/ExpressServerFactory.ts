import { Express } from 'express'
import { ExpressServer } from './ExpressServer'
import { HttpContext } from './HttpContext'
import { HttpServer, HttpServerFactory } from './HttpServer'
import { ExpressConfigurations } from './config'

export class ExpressServerFactory implements HttpServerFactory<Express> {
  build(context: HttpContext<ExpressConfigurations>): HttpServer<Express> {
    return new ExpressServer(context)
  }
}
