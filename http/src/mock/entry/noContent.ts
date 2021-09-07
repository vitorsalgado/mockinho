import { StatusCodes } from '../../types'
import { DefaultResponseBuilder } from '../../types'
import { response } from './response'

export const noContent = (): DefaultResponseBuilder => response().status(StatusCodes.NO_CONTENT)
