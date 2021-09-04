import { Plugin } from './Plugin'
import { MockRepository } from './MockRepository'
import { BaseConfiguration } from './BaseConfiguration'
import { Mock } from './Mock'
import { Context } from './Context'

export type PluginFactory = <
  C extends BaseConfiguration,
  S extends Mock,
  SR extends MockRepository<S>,
  CTX extends Context<C, S, SR>,
  REQ
>(
  context: CTX
) => Plugin<REQ, S>
