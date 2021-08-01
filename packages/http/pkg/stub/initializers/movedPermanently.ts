import { StatusCodes } from '../../types'
import { HttpResponseDefinitionBuilder } from '../HttpResponseDefinitionBuilder'
import { response } from './response'

export const movedPermanently = (location?: string): HttpResponseDefinitionBuilder =>
  response().status(StatusCodes.MOVED_PERMANENTLY).headerLocation(location)
