import { StatusCodes } from '../../StatusCodes'
import { ResponseBuilder } from '../ResponseBuilder'
import { response } from './response'

export const seeOther = (location?: string): ResponseBuilder =>
  response().status(StatusCodes.SEE_OTHER).headerLocation(location)
