import { JsonType } from '@mockdog/x'
import { StatusCodes } from '../../http.js'
import { ResponseBuilder } from '../ResponseBuilder.js'
import { response } from './response.js'

export const notFound = (): ResponseBuilder => response().status(StatusCodes.NOT_FOUND)

export const notFoundJSON = (body: JsonType): ResponseBuilder => notFound().bodyJSON(body)
