import { HttpResponseFixtureBuilder } from '../HttpResponseFixtureBuilder'
import { DefaultResponseBuilder } from '../../types'

export const response = (): DefaultResponseBuilder => HttpResponseFixtureBuilder.newBuilder()
