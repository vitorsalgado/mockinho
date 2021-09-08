import { DefaultResponseBuilder } from '../../types'
import { StatusCodes } from '../../StatusCodes'
import { JsonType } from '../../types'
import { response } from './response'

export const forbidden = (): DefaultResponseBuilder => response().status(StatusCodes.FORBIDDEN)

export const forbiddenJSON = (body: JsonType): DefaultResponseBuilder => forbidden().bodyJSON(body)
