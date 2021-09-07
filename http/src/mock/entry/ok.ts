import { DefaultResponseBuilder } from '../../types'
import { HttpResponseFixtureBuilder } from '../HttpResponseFixtureBuilder'
import { StatusCodes } from '../../StatusCodes'

export const ok = (): DefaultResponseBuilder =>
  HttpResponseFixtureBuilder.newBuilder().status(StatusCodes.OK)

export const okJSON = (body: Record<string, unknown>): DefaultResponseBuilder => ok().bodyJSON(body)
