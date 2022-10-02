import { JsonType } from '@mockdog/x'
import { StatusCodes } from '../../http.js'
import { ResponseBuilder } from '../ResponseBuilder.js'
import { response } from './response.js'

export const forbidden = (): ResponseBuilder => response().status(StatusCodes.FORBIDDEN)

export const forbiddenJSON = (body: JsonType): ResponseBuilder => forbidden().bodyJSON(body)
