import { ExpressServer } from './ExpressServer'
import { HttpContext } from './HttpContext'
import { HttpServer, HttpServerFactory } from './HttpServer'
import { ExpressConfigurations } from './config'

export class ExpressServerFactory implements HttpServerFactory {
  build(context: HttpContext<ExpressConfigurations>): HttpServer {
    return new ExpressServer(context)
  }
}
