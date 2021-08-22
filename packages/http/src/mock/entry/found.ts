import { StatusCodes } from '../../types'
import { DecoratedResponseBuilder } from '../../types'
import { response } from './response'

export const found = (location?: string): DecoratedResponseBuilder =>
  response().headerLocation(location).status(StatusCodes.FOUND)
