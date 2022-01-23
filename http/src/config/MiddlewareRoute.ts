import { Middleware } from './Middleware.js'

export interface MiddlewareRoute {
  route: string
  middleware: Middleware
}
