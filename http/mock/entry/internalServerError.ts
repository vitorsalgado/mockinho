import { JsonType } from '@mockdog/x'
import { StatusCodes } from '../../http.js'
import { ResponseBuilder } from '../ResponseBuilder.js'
import { response } from './response.js'

export const internalServerError = (): ResponseBuilder =>
  response().status(StatusCodes.INTERNAL_SERVER_ERROR)

export const internalServerErrorJSON = (body: JsonType): ResponseBuilder =>
  internalServerError().bodyJSON(body)
