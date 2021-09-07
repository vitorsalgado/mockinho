import { DefaultResponseBuilder } from '../../types'
import { StatusCodes } from '../../StatusCodes'
import { response } from './response'

export const seeOther = (location?: string): DefaultResponseBuilder =>
  response().status(StatusCodes.SEE_OTHER).headerLocation(location)
