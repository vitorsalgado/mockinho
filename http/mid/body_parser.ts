import { NextFunction, Response } from 'express'
import { BodyType } from '../http.js'
import { SrvRequest } from '../request.js'

export interface RequestBodyParser {
  canParse(req: SrvRequest): boolean

  body(req: SrvRequest): Promise<BodyType> | BodyType
}

export function bodyParser(parsers: Array<RequestBodyParser>) {
  return async function (req: SrvRequest, res: Response, next: NextFunction) {
    if (parsers.length === 0) {
      return next()
    }

    for await (const p of parsers) {
      if (p.canParse(req)) {
        const b = p.body(req)

        if (typeof b === 'object' && 'then' in (b as any)) {
          req.body = await b
        } else {
          req.body = b
        }

        break
      }
    }

    return next()
  }
}
