import { JsonType } from '@mockdog/core'
import { ResponseBuilder } from '../ResponseBuilder.js'
import { StatusCodes } from '../../StatusCodes.js'

export const ok = (): ResponseBuilder => ResponseBuilder.newBuilder().status(StatusCodes.OK)

export const okJSON = (body: JsonType): ResponseBuilder => ok().bodyJSON(body)
