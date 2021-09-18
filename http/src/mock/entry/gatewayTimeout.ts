import { JsonType } from '@mockdog/core'
import { StatusCodes } from '../../StatusCodes'
import { ResponseBuilder } from '../ResponseBuilder'
import { response } from './response'

export const gatewayTimeout = (): ResponseBuilder => response().status(StatusCodes.GATEWAY_TIMEOUT)

export const gatewayTimeoutJSON = (body: JsonType): ResponseBuilder =>
  gatewayTimeout().bodyJSON(body)
