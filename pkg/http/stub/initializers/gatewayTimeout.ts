import { BodyType, StatusCodes } from '../../types'
import { HttpResponseDefinitionBuilder } from '../HttpResponseDefinitionBuilder'
import { response } from './response'

export const gatewayTimeout = (): HttpResponseDefinitionBuilder =>
  response().status(StatusCodes.GATEWAY_TIMEOUT)

export const gatewayTimeoutJSON = (
  body: BodyType | Record<string, unknown>
): HttpResponseDefinitionBuilder => gatewayTimeout().bodyJSON(body)
