import { Response } from 'express'
import { NextFunction } from 'express'
import { HttpRequest } from '../HttpRequest.js'

export type Middleware = (
  req: HttpRequest,
  res: Response,
  next: NextFunction
) => void | Promise<void>
