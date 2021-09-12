import { StatusCodes } from '../../StatusCodes'
import { ResponseBuilder } from '../ResponseBuilder'
import { response } from './response'

export const found = (location?: string): ResponseBuilder =>
  response().headerLocation(location).status(StatusCodes.FOUND)
