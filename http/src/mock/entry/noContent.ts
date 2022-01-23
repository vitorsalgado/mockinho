import { StatusCodes } from '../../StatusCodes.js'
import { ResponseBuilder } from '../ResponseBuilder.js'
import { response } from './response.js'

export const noContent = (): ResponseBuilder => response().status(StatusCodes.NO_CONTENT)
