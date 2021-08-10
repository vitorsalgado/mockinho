import { StatusCodes } from '../../types'
import { DecoratedResponseBuilder } from '../../types'
import { response } from './response'

export const serviceUnavailable = (): DecoratedResponseBuilder =>
  response().status(StatusCodes.SERVICE_UNAVAILABLE)

export const serviceUnavailableJSON = (body: Record<string, unknown>): DecoratedResponseBuilder =>
  serviceUnavailable().bodyJSON(body)
