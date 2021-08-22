// import { Plugin } from './Plugin'
// import { Stub } from './Stub'
// import { ScenarioRepository } from './ScenarioRepository'
// import { Scenario } from './Scenario'
//
// export class ScenarioPlugin<Req, Res, M extends Stub<Req, Res>> implements Plugin<Req, Res, M> {
//   constructor(private readonly scenarioRepository: ScenarioRepository) {}
//
//   onMockInit(mock: M): M {
//     const scenario = mock.getProperty<Scenario>('scenario')
//
//     return Promise.resolve(mock)
//   }
// }
