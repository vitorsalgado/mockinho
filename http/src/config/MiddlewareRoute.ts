import { Middleware } from './Middleware'

export interface MiddlewareRoute {
  route: string
  middleware: Middleware
}
