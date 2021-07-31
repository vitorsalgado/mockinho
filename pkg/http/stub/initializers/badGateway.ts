import { BodyType, StatusCodes } from '../../types'
import { HttpResponseDefinitionBuilder } from '../HttpResponseDefinitionBuilder'
import { response } from './response'

export const badGateway = (): HttpResponseDefinitionBuilder =>
  response().status(StatusCodes.BAD_GATEWAY)

export const badGatewayJSON = (
  body: BodyType | Record<string, unknown>
): HttpResponseDefinitionBuilder => badGateway().bodyJSON(body)
