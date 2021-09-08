import { Response } from 'express'
import { NextFunction } from 'express'
import { HttpRequest } from '../HttpRequest'

export type PreMiddleware = (
  req: HttpRequest,
  res: Response,
  next: NextFunction
) => void | Promise<void>
