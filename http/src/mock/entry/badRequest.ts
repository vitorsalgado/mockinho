import { JsonType } from '@mockdog/core'
import { StatusCodes } from '../../StatusCodes.js'
import { ResponseBuilder } from '../ResponseBuilder.js'
import { response } from './response.js'

export const badRequest = (): ResponseBuilder => response().status(StatusCodes.BAD_REQUEST)

export const badRequestJSON = (body: JsonType): ResponseBuilder => badRequest().bodyJSON(body)
