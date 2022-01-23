import { JsonType } from '@mockdog/core'
import { StatusCodes } from '../../StatusCodes.js'
import { ResponseBuilder } from '../ResponseBuilder.js'
import { response } from './response.js'

export const internalServerError = (): ResponseBuilder =>
  response().status(StatusCodes.INTERNAL_SERVER_ERROR)

export const internalServerErrorJSON = (body: JsonType): ResponseBuilder =>
  internalServerError().bodyJSON(body)
