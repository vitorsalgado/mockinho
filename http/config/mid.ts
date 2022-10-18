import { NextFunction, Response } from 'express'
import { SrvRequest } from '../request.js'

export type Middleware = (
  req: SrvRequest,
  res: Response,
  next: NextFunction,
) => void | Promise<void>

export interface MiddlewareRoute {
  route: string
  middleware: Middleware
}
