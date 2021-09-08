import { DefaultResponseBuilder } from '../../types'
import { JsonType } from '../../types'
import { StatusCodes } from '../../StatusCodes'
import { response } from './response'

export const badGateway = (): DefaultResponseBuilder => response().status(StatusCodes.BAD_GATEWAY)

export const badGatewayJSON = (body: JsonType): DefaultResponseBuilder =>
  badGateway().bodyJSON(body)
