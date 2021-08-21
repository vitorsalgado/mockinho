import { HttpStubBuilder } from '../stub'
import { HttpServer } from '../HttpServer'

export interface MockProvider {
  mocks(server: HttpServer): Promise<Array<HttpStubBuilder>>
}
