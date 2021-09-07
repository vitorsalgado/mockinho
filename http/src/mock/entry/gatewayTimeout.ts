import { StatusCodes } from '../../types'
import { DefaultResponseBuilder } from '../../types'
import { response } from './response'

export const gatewayTimeout = (): DefaultResponseBuilder =>
  response().status(StatusCodes.GATEWAY_TIMEOUT)

export const gatewayTimeoutJSON = (body: Record<string, unknown>): DefaultResponseBuilder =>
  gatewayTimeout().bodyJSON(body)
