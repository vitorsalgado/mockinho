import { StatusCodes } from '../../types'
import { DefaultResponseBuilder } from '../../types'
import { response } from './response'

export const found = (location?: string): DefaultResponseBuilder =>
  response().headerLocation(location).status(StatusCodes.FOUND)
