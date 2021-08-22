import { StatusCodes } from '../../types'
import { DecoratedResponseBuilder } from '../../types'
import { response } from './response'

export const seeOther = (location?: string): DecoratedResponseBuilder =>
  response().status(StatusCodes.SEE_OTHER).headerLocation(location)
