import { HttpStubBuilder } from '../stub'

export interface MockProvider {
  mocks(): Promise<Array<HttpStubBuilder>>
}
