import { Response } from 'express'
import { NextFunction } from 'express'
import { HttpRequest } from '../HttpRequest'

export type Middleware = (
  req: HttpRequest,
  res: Response,
  next: NextFunction
) => void | Promise<void>
