import { DefaultResponseBuilder } from '../../types'
import { StatusCodes } from '../../StatusCodes'
import { response } from './response'

export const accepted = (): DefaultResponseBuilder => response().status(StatusCodes.ACCEPTED)
