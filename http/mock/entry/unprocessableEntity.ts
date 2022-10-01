import { JsonType } from '@mockdog/x'
import { StatusCodes } from '../../StatusCodes.js'
import { ResponseBuilder } from '../ResponseBuilder.js'
import { response } from './response.js'

export const unprocessableEntity = (): ResponseBuilder =>
  response().status(StatusCodes.UNPROCESSABLE_ENTITY)

export const unprocessableEntityJSON = (body: JsonType): ResponseBuilder =>
  unprocessableEntity().bodyJSON(body)
