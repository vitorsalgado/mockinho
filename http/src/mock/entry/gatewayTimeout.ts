import { DefaultResponseBuilder } from '../../types'
import { StatusCodes } from '../../StatusCodes'
import { JsonType } from '../../types'
import { response } from './response'

export const gatewayTimeout = (): DefaultResponseBuilder =>
  response().status(StatusCodes.GATEWAY_TIMEOUT)

export const gatewayTimeoutJSON = (body: JsonType): DefaultResponseBuilder =>
  gatewayTimeout().bodyJSON(body)
