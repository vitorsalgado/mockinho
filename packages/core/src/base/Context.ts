import { Configuration } from './Configuration'
import { MockRepository } from './MockRepository'
import { Mock } from './Mock'

export interface Context<C extends Configuration, S extends Mock, R extends MockRepository<S>> {
  configurations: C

  mockRepository: R
}
