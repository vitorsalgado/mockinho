import { JsonType } from '@mockdog/x'
import { StatusCodes } from '../../http.js'
import { ResponseBuilder } from '../ResponseBuilder.js'
import { response } from './response.js'

export const badGateway = (): ResponseBuilder => response().status(StatusCodes.BAD_GATEWAY)

export const badGatewayJSON = (body: JsonType): ResponseBuilder => badGateway().bodyJSON(body)
