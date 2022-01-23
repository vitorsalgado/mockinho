import { JsonType } from '@mockdog/core'
import { StatusCodes } from '../../StatusCodes.js'
import { ResponseBuilder } from '../ResponseBuilder.js'
import { response } from './response.js'

export const badGateway = (): ResponseBuilder => response().status(StatusCodes.BAD_GATEWAY)

export const badGatewayJSON = (body: JsonType): ResponseBuilder => badGateway().bodyJSON(body)
