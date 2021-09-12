import { StatusCodes } from '../../StatusCodes'
import { ResponseBuilder } from '../ResponseBuilder'
import { response } from './response'

export const movedPermanently = (location?: string): ResponseBuilder =>
  response().status(StatusCodes.MOVED_PERMANENTLY).headerLocation(location)
