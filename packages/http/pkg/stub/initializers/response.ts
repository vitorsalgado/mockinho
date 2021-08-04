import { HttpResponseDefinitionBuilder } from '../HttpResponseDefinitionBuilder'
import { DecoratedResponseBuilder } from '../../types'

export const response = (): DecoratedResponseBuilder => HttpResponseDefinitionBuilder.newBuilder()
