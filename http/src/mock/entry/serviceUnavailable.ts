import { JsonType } from '@mockdog/core'
import { StatusCodes } from '../../StatusCodes'
import { ResponseBuilder } from '../ResponseBuilder'
import { response } from './response'

export const serviceUnavailable = (): ResponseBuilder =>
  response().status(StatusCodes.SERVICE_UNAVAILABLE)

export const serviceUnavailableJSON = (body: JsonType): ResponseBuilder =>
  serviceUnavailable().bodyJSON(body)
