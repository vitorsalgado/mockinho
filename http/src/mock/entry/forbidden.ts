import { StatusCodes } from '../../types'
import { DefaultResponseBuilder } from '../../types'
import { response } from './response'

export const forbidden = (): DefaultResponseBuilder => response().status(StatusCodes.FORBIDDEN)

export const forbiddenJSON = (body: Record<string, unknown>): DefaultResponseBuilder =>
  forbidden().bodyJSON(body)
