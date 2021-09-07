import { StatusCodes } from '../../types'
import { DefaultResponseBuilder } from '../../types'
import { response } from './response'

export const serviceUnavailable = (): DefaultResponseBuilder =>
  response().status(StatusCodes.SERVICE_UNAVAILABLE)

export const serviceUnavailableJSON = (body: Record<string, unknown>): DefaultResponseBuilder =>
  serviceUnavailable().bodyJSON(body)
