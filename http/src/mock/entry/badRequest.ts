import { DefaultResponseBuilder } from '../../types'
import { StatusCodes } from '../../StatusCodes'
import { JsonType } from '../../types'
import { response } from './response'

export const badRequest = (): DefaultResponseBuilder => response().status(StatusCodes.BAD_REQUEST)

export const badRequestJSON = (body: JsonType): DefaultResponseBuilder =>
  badRequest().bodyJSON(body)
