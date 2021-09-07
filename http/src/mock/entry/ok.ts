import { StatusCodes } from '../../types'
import { DefaultResponseBuilder } from '../../types'
import { HttpResponseFixtureBuilder } from '../HttpResponseFixtureBuilder'

export const ok = (): DefaultResponseBuilder =>
  HttpResponseFixtureBuilder.newBuilder().status(StatusCodes.OK)

export const okJSON = (body: Record<string, unknown>): DefaultResponseBuilder => ok().bodyJSON(body)
