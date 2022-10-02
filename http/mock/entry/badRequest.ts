import { JsonType } from '@mockdog/x'
import { StatusCodes } from '../../http.js'
import { ResponseBuilder } from '../ResponseBuilder.js'
import { response } from './response.js'

export const badRequest = (): ResponseBuilder => response().status(StatusCodes.BAD_REQUEST)

export const badRequestJSON = (body: JsonType): ResponseBuilder => badRequest().bodyJSON(body)
