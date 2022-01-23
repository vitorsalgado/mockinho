import { StatusCodes } from '../../StatusCodes.js'
import { ResponseBuilder } from '../ResponseBuilder.js'
import { response } from './response.js'

export const movedPermanently = (location?: string): ResponseBuilder =>
  response().status(StatusCodes.MOVED_PERMANENTLY).headerLocation(location)
