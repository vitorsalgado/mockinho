import { Plugin } from './Plugin'
import { MockRepository } from './MockRepository'
import { Configuration } from './Configuration'
import { Mock } from './Mock'
import { Context } from './Context'

export type PluginFactory = <
  C extends Configuration,
  S extends Mock,
  SR extends MockRepository<S>,
  Ctx extends Context<C, S, SR>,
  Req
>(
  context: Ctx
) => Plugin<Req, S>
