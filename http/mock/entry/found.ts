import { StatusCodes } from '../../StatusCodes.js'
import { ResponseBuilder } from '../ResponseBuilder.js'
import { response } from './response.js'

export const found = (location?: string): ResponseBuilder =>
  response().headerLocation(location).status(StatusCodes.FOUND)
