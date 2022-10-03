import { Mock } from './mock.js'

export interface MockBuilder<MOCK extends Mock, DEPS> {
  build(deps: DEPS): MOCK
}
