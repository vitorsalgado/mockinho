import { Response } from 'express'
import { NextFunction } from 'express'
import { SrvRequest } from '../request.js'

export type Middleware = (
  req: SrvRequest,
  res: Response,
  next: NextFunction,
) => void | Promise<void>
