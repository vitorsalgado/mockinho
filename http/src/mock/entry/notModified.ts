import { StatusCodes } from '../../StatusCodes'
import { ResponseBuilder } from '../ResponseBuilder'
import { response } from './response'

export const notModified = (): ResponseBuilder => response().status(StatusCodes.NOT_MODIFIED)
