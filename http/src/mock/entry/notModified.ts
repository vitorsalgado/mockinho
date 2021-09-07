import { StatusCodes } from '../../types'
import { DefaultResponseBuilder } from '../../types'
import { response } from './response'

export const notModified = (): DefaultResponseBuilder => response().status(StatusCodes.NOT_MODIFIED)
