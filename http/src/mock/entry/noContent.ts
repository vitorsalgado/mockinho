import { DefaultResponseBuilder } from '../../types'
import { StatusCodes } from '../../StatusCodes'
import { response } from './response'

export const noContent = (): DefaultResponseBuilder => response().status(StatusCodes.NO_CONTENT)
