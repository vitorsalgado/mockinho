import { DefaultResponseBuilder } from '../../types'
import { StatusCodes } from '../../StatusCodes'
import { response } from './response'

export const notModified = (): DefaultResponseBuilder => response().status(StatusCodes.NOT_MODIFIED)
