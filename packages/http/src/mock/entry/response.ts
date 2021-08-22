import { HttpResponseFixtureBuilder } from '../HttpResponseFixtureBuilder'
import { DecoratedResponseBuilder } from '../../types'

export const response = (): DecoratedResponseBuilder => HttpResponseFixtureBuilder.newBuilder()
