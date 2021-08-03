import { HttpResponseDefinitionBuilder } from '../HttpResponseDefinitionBuilder'
import { HttpServerFactory } from '../../HttpServer'
import { Configurations } from '../../config'

export const response = <
  SF extends HttpServerFactory,
  C extends Configurations<SF>
>(): HttpResponseDefinitionBuilder<SF, C> => new HttpResponseDefinitionBuilder()
