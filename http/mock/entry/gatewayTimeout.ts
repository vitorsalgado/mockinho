import { JsonType } from '@mockdog/x'
import { StatusCodes } from '../../StatusCodes.js'
import { ResponseBuilder } from '../ResponseBuilder.js'
import { response } from './response.js'

export const gatewayTimeout = (): ResponseBuilder => response().status(StatusCodes.GATEWAY_TIMEOUT)

export const gatewayTimeoutJSON = (body: JsonType): ResponseBuilder =>
  gatewayTimeout().bodyJSON(body)
