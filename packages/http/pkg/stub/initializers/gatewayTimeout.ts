import { StatusCodes } from '../../types'
import { HttpResponseDefinitionBuilder } from '../HttpResponseDefinitionBuilder'
import { response } from './response'

export const gatewayTimeout = (): HttpResponseDefinitionBuilder =>
  response().status(StatusCodes.GATEWAY_TIMEOUT)

export const gatewayTimeoutJSON = (body: Record<string, unknown>): HttpResponseDefinitionBuilder =>
  gatewayTimeout().bodyJSON(body)
