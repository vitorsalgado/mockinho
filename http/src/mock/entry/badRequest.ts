import { JsonType } from '@mockdog/core'
import { StatusCodes } from '../../StatusCodes'
import { ResponseBuilder } from '../ResponseBuilder'
import { response } from './response'

export const badRequest = (): ResponseBuilder => response().status(StatusCodes.BAD_REQUEST)

export const badRequestJSON = (body: JsonType): ResponseBuilder => badRequest().bodyJSON(body)