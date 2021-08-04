import { StatusCodes } from '../../types'
import { DecoratedResponseBuilder } from '../../types'
import { response } from './response'

export const movedPermanently = (location?: string): DecoratedResponseBuilder =>
  response().status(StatusCodes.MOVED_PERMANENTLY).headerLocation(location)
