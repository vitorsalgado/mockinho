import { StatusCodes } from '../../types'
import { DefaultResponseBuilder } from '../../types'
import { response } from './response'

export const badRequest = (): DefaultResponseBuilder => response().status(StatusCodes.BAD_REQUEST)

export const badRequestJSON = (body: Record<string, unknown>): DefaultResponseBuilder =>
  badRequest().bodyJSON(body)
