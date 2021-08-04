import { StatusCodes } from '../../types'
import { DecoratedResponseBuilder } from '../../types'
import { response } from './response'

export const badGateway = (): DecoratedResponseBuilder => response().status(StatusCodes.BAD_GATEWAY)

export const badGatewayJSON = (body: Record<string, unknown>): DecoratedResponseBuilder =>
  badGateway().bodyJSON(body)
