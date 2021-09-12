import { StatusCodes } from '../../StatusCodes'
import { ResponseBuilder } from '../ResponseBuilder'
import { response } from './response'

export const noContent = (): ResponseBuilder => response().status(StatusCodes.NO_CONTENT)
