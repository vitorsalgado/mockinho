import { DefaultResponseBuilder } from '../../types'
import { StatusCodes } from '../../StatusCodes'
import { JsonType } from '../../types'
import { response } from './response'

export const serviceUnavailable = (): DefaultResponseBuilder =>
  response().status(StatusCodes.SERVICE_UNAVAILABLE)

export const serviceUnavailableJSON = (body: JsonType): DefaultResponseBuilder =>
  serviceUnavailable().bodyJSON(body)
