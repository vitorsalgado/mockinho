import { StatusCodes } from '../../types'
import { HttpResponseDefinitionBuilder } from '../HttpResponseDefinitionBuilder'
import { response } from './response'

export const seeOther = (location?: string): HttpResponseDefinitionBuilder =>
  response().status(StatusCodes.SEE_OTHER).headerLocation(location)
