import { StatusCodes } from '../../StatusCodes'
import { ResponseBuilder } from '../ResponseBuilder'
import { response } from './response'

export const accepted = (): ResponseBuilder => response().status(StatusCodes.ACCEPTED)
