import { StatusCodes } from '../../types'
import { DecoratedResponseBuilder } from '../../types'
import { response } from './response'

export const badRequest = (): DecoratedResponseBuilder => response().status(StatusCodes.BAD_REQUEST)

export const badRequestJSON = (body: Record<string, unknown>): DecoratedResponseBuilder =>
  badRequest().bodyJSON(body)
