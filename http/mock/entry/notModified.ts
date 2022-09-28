import { StatusCodes } from '../../StatusCodes.js'
import { ResponseBuilder } from '../ResponseBuilder.js'
import { response } from './response.js'

export const notModified = (): ResponseBuilder => response().status(StatusCodes.NOT_MODIFIED)