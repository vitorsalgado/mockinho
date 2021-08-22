import { StatusCodes } from '../../types'
import { DecoratedResponseBuilder } from '../../types'
import { HttpResponseFixtureBuilder } from '../HttpResponseFixtureBuilder'

export const ok = (): DecoratedResponseBuilder =>
  HttpResponseFixtureBuilder.newBuilder().status(StatusCodes.OK)

export const okJSON = (body: Record<string, unknown>): DecoratedResponseBuilder =>
  ok().bodyJSON(body)
