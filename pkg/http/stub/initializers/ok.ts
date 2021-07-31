import { BodyType, StatusCodes } from '../../types'
import { HttpResponseDefinitionBuilder } from '../HttpResponseDefinitionBuilder'

export const ok = (): HttpResponseDefinitionBuilder =>
  HttpResponseDefinitionBuilder.newBuilder().status(StatusCodes.OK)

export const okJSON = (body: BodyType | Record<string, unknown>): HttpResponseDefinitionBuilder =>
  ok().bodyJSON(body)
