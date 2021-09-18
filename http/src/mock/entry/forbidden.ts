import { JsonType } from '@mockdog/core'
import { StatusCodes } from '../../StatusCodes'
import { ResponseBuilder } from '../ResponseBuilder'
import { response } from './response'

export const forbidden = (): ResponseBuilder => response().status(StatusCodes.FORBIDDEN)

export const forbiddenJSON = (body: JsonType): ResponseBuilder => forbidden().bodyJSON(body)
