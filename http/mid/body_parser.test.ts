import { NextFunction, Response } from 'express'
import { BodyType } from '../http.js'
import { SrvRequest } from '../request.js'
import { bodyParser, RequestBodyParser } from './body_parser.js'

describe('Request Body Parser', function () {
  it('should continue when there is no request parser', function () {
    const req = {} as unknown as SrvRequest
    const res: Response = {} as unknown as Response
    const next: NextFunction = jest.fn()

    bodyParser([])(req, res, next)

    expect(next).toHaveBeenCalledTimes(1)
  })

  describe('when multiple parser are provided', function () {
    class HW implements RequestBodyParser {
      body = (req: SrvRequest): Promise<BodyType> | BodyType => 'hello world'
      canParse = (req: SrvRequest): boolean => true
    }

    class Sec implements RequestBodyParser {
      body = (req: SrvRequest): Promise<BodyType> | BodyType => Promise.resolve('test')
      canParse = (req: SrvRequest): boolean => true
    }

    class Nope implements RequestBodyParser {
      body = (req: SrvRequest): Promise<BodyType> | BodyType => 'nope'
      canParse = (req: SrvRequest): boolean => false
    }

    it('should use the first one that returns true', async function () {
      const req = {} as unknown as SrvRequest
      const res: Response = {} as unknown as Response
      const next: NextFunction = jest.fn()

      await bodyParser([new Nope(), new HW(), new Sec()])(req, res, next)

      expect(req.body).toEqual('hello world')
      expect(next).toHaveBeenCalledTimes(1)
    })

    it('should accept a promise return', async function () {
      const req = {} as unknown as SrvRequest
      const res: Response = {} as unknown as Response
      const next: NextFunction = jest.fn()

      await bodyParser([new Nope(), new Sec(), new HW()])(req, res, next)

      expect(req.body).toEqual('test')
      expect(next).toHaveBeenCalledTimes(1)
    })
  })
})
