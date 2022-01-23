import { JsonType } from '@mockdog/core'
import { StatusCodes } from '../../StatusCodes.js'
import { ResponseBuilder } from '../ResponseBuilder.js'
import { response } from './response.js'

export const serviceUnavailable = (): ResponseBuilder =>
  response().status(StatusCodes.SERVICE_UNAVAILABLE)

export const serviceUnavailableJSON = (body: JsonType): ResponseBuilder =>
  serviceUnavailable().bodyJSON(body)
