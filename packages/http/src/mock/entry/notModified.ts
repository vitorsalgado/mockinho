import { StatusCodes } from '../../types'
import { DecoratedResponseBuilder } from '../../types'
import { response } from './response'

export const notModified = (): DecoratedResponseBuilder =>
  response().status(StatusCodes.NOT_MODIFIED)
