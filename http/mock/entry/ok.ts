import { JsonType } from '@mockdog/x'
import { StatusCodes } from '../../http.js'
import { ResponseBuilder } from '../ResponseBuilder.js'

export const ok = (): ResponseBuilder => ResponseBuilder.newBuilder().status(StatusCodes.OK)

export const okJSON = (body: JsonType): ResponseBuilder => ok().bodyJSON(body)
