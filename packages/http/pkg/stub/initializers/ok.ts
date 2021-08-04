import { StatusCodes } from '../../types'
import { DecoratedResponseBuilder } from '../../types'
import { HttpResponseDefinitionBuilder } from '../HttpResponseDefinitionBuilder'

export const ok = (): DecoratedResponseBuilder =>
  HttpResponseDefinitionBuilder.newBuilder().status(StatusCodes.OK)

export const okJSON = (body: Record<string, unknown>): DecoratedResponseBuilder =>
  ok().bodyJSON(body)
