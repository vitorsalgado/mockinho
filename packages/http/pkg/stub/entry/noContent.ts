import { StatusCodes } from '../../types'
import { DecoratedResponseBuilder } from '../../types'
import { response } from './response'

export const noContent = (): DecoratedResponseBuilder => response().status(StatusCodes.NO_CONTENT)
