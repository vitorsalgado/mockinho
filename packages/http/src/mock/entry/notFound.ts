import { StatusCodes } from '../../types'
import { DecoratedResponseBuilder } from '../../types'
import { response } from './response'

export const notFound = (): DecoratedResponseBuilder => response().status(StatusCodes.NOT_FOUND)

export const notFoundJSON = (body: Record<string, unknown>): DecoratedResponseBuilder =>
  notFound().bodyJSON(body)
