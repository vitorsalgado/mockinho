import { DefaultResponseBuilder } from '../../types'
import { StatusCodes } from '../../StatusCodes'
import { response } from './response'

export const notFound = (): DefaultResponseBuilder => response().status(StatusCodes.NOT_FOUND)

export const notFoundJSON = (body: Record<string, unknown>): DefaultResponseBuilder =>
  notFound().bodyJSON(body)
