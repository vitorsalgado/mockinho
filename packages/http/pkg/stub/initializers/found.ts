import { StatusCodes } from '../../types'
import { HttpResponseDefinitionBuilder } from '../HttpResponseDefinitionBuilder'
import { response } from './response'

export const found = (location?: string): HttpResponseDefinitionBuilder =>
  response().headerLocation(location).status(StatusCodes.FOUND)
