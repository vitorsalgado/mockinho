import { JsonType } from '@mockdog/core'
import { StatusCodes } from '../../StatusCodes.js'
import { ResponseBuilder } from '../ResponseBuilder.js'
import { response } from './response.js'

export const notFound = (): ResponseBuilder => response().status(StatusCodes.NOT_FOUND)

export const notFoundJSON = (body: JsonType): ResponseBuilder => notFound().bodyJSON(body)
