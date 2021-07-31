import { StatusCodes } from '../../types'
import { HttpResponseDefinitionBuilder } from '../HttpResponseDefinitionBuilder'
import { response } from './response'

export const noContent = (): HttpResponseDefinitionBuilder =>
  response().status(StatusCodes.NO_CONTENT)
