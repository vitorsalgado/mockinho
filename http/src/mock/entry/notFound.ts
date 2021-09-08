import { DefaultResponseBuilder } from '../../types'
import { StatusCodes } from '../../StatusCodes'
import { JsonType } from '../../types'
import { response } from './response'

export const notFound = (): DefaultResponseBuilder => response().status(StatusCodes.NOT_FOUND)

export const notFoundJSON = (body: JsonType): DefaultResponseBuilder => notFound().bodyJSON(body)
