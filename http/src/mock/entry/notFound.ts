import { JsonType } from '@mockinho/core'
import { StatusCodes } from '../../StatusCodes'
import { ResponseBuilder } from '../ResponseBuilder'
import { response } from './response'

export const notFound = (): ResponseBuilder => response().status(StatusCodes.NOT_FOUND)

export const notFoundJSON = (body: JsonType): ResponseBuilder => notFound().bodyJSON(body)
