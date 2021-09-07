import { DefaultResponseBuilder } from '../../types'
import { StatusCodes } from '../../StatusCodes'
import { response } from './response'

export const movedPermanently = (location?: string): DefaultResponseBuilder =>
  response().status(StatusCodes.MOVED_PERMANENTLY).headerLocation(location)
