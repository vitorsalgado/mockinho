import { StatusCodes } from '../../types'
import { HttpResponseDefinitionBuilder } from '../HttpResponseDefinitionBuilder'
import { response } from './response'

export const notModified = (): HttpResponseDefinitionBuilder =>
  response().status(StatusCodes.NOT_MODIFIED)
