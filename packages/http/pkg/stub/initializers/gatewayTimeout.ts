import { StatusCodes } from '../../types'
import { DecoratedResponseBuilder } from '../../types'
import { response } from './response'

export const gatewayTimeout = (): DecoratedResponseBuilder =>
  response().status(StatusCodes.GATEWAY_TIMEOUT)

export const gatewayTimeoutJSON = (body: Record<string, unknown>): DecoratedResponseBuilder =>
  gatewayTimeout().bodyJSON(body)
