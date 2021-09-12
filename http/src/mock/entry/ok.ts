import { JsonType } from '@mockinho/core'
import { ResponseBuilder } from '../ResponseBuilder'
import { StatusCodes } from '../../StatusCodes'

export const ok = (): ResponseBuilder => ResponseBuilder.newBuilder().status(StatusCodes.OK)

export const okJSON = (body: JsonType): ResponseBuilder => ok().bodyJSON(body)
