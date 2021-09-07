import { DefaultResponseBuilder } from '../../types'
import { StatusCodes } from '../../StatusCodes'
import { response } from './response'

export const badRequest = (): DefaultResponseBuilder => response().status(StatusCodes.BAD_REQUEST)

export const badRequestJSON = (body: Record<string, unknown>): DefaultResponseBuilder =>
  badRequest().bodyJSON(body)
