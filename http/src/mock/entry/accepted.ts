import { StatusCodes } from '../../types'
import { DefaultResponseBuilder } from '../../types'
import { response } from './response'

export const accepted = (): DefaultResponseBuilder => response().status(StatusCodes.ACCEPTED)
