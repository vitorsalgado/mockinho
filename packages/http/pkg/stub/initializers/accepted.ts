import { StatusCodes } from '../../types'
import { DecoratedResponseBuilder } from '../../types'
import { response } from './response'

export const accepted = (): DecoratedResponseBuilder => response().status(StatusCodes.ACCEPTED)
