import { DefaultResponseBuilder } from '../../types'
import { JsonType } from '../../types'
import { HttpResponseFixtureBuilder } from '../HttpResponseFixtureBuilder'
import { StatusCodes } from '../../StatusCodes'

export const ok = (): DefaultResponseBuilder =>
  HttpResponseFixtureBuilder.newBuilder().status(StatusCodes.OK)

export const okJSON = (body: JsonType): DefaultResponseBuilder => ok().bodyJSON(body)
