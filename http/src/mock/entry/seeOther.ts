import { StatusCodes } from '../../StatusCodes.js'
import { ResponseBuilder } from '../ResponseBuilder.js'
import { response } from './response.js'

export const seeOther = (location?: string): ResponseBuilder =>
  response().status(StatusCodes.SEE_OTHER).headerLocation(location)
