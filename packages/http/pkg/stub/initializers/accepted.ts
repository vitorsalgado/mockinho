import { StatusCodes } from '../../types'
import { HttpResponseDefinitionBuilder } from '../HttpResponseDefinitionBuilder'
import { response } from './response'

export const accepted = (): HttpResponseDefinitionBuilder => response().status(StatusCodes.ACCEPTED)
