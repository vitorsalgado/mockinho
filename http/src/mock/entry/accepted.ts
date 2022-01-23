import { StatusCodes } from '../../StatusCodes.js'
import { ResponseBuilder } from '../ResponseBuilder.js'
import { response } from './response.js'

export const accepted = (): ResponseBuilder => response().status(StatusCodes.ACCEPTED)
