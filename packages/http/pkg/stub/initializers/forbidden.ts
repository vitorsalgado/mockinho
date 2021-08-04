import { StatusCodes } from '../../types'
import { DecoratedResponseBuilder } from '../../types'
import { response } from './response'

export const forbidden = (): DecoratedResponseBuilder => response().status(StatusCodes.FORBIDDEN)

export const forbiddenJSON = (body: Record<string, unknown>): DecoratedResponseBuilder =>
  forbidden().bodyJSON(body)
