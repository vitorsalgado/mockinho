import { JsonType } from '@mockdog/core'
import { StatusCodes } from '../../StatusCodes'
import { ResponseBuilder } from '../ResponseBuilder'
import { response } from './response'

export const badGateway = (): ResponseBuilder => response().status(StatusCodes.BAD_GATEWAY)

export const badGatewayJSON = (body: JsonType): ResponseBuilder => badGateway().bodyJSON(body)
