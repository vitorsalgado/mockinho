import { BodyType, StatusCodes } from '../../types'
import { HttpResponseDefinitionBuilder } from '../HttpResponseDefinitionBuilder'
import { response } from './response'

export const serviceUnavailable = (): HttpResponseDefinitionBuilder =>
  response().status(StatusCodes.SERVICE_UNAVAILABLE)

export const serviceUnavailableJSON = (
  body: BodyType | Record<string, unknown>
): HttpResponseDefinitionBuilder => serviceUnavailable().bodyJSON(body)
