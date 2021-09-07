import { DefaultResponseBuilder } from '../../types'
import { StatusCodes } from '../../StatusCodes'
import { response } from './response'

export const found = (location?: string): DefaultResponseBuilder =>
  response().headerLocation(location).status(StatusCodes.FOUND)
