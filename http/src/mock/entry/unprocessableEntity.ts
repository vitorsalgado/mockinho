import { JsonType } from '@mockinho/core'
import { StatusCodes } from '../../StatusCodes'
import { ResponseBuilder } from '../ResponseBuilder'
import { response } from './response'

export const unprocessableEntity = (): ResponseBuilder =>
  response().status(StatusCodes.UNPROCESSABLE_ENTITY)

export const unprocessableEntityJSON = (body: JsonType): ResponseBuilder =>
  unprocessableEntity().bodyJSON(body)
