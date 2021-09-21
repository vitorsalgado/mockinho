import { scenarioMatcher } from '../scenarioMatcher'
import { Context } from '../Context'
import { BaseConfiguration } from '../BaseConfiguration'
import { MockInMemoryRepository } from '../MockInMemoryRepository'
import { Mock } from '../Mock'
import { ScenarioInMemoryRepository } from '../ScenarioInMemoryRepository'
import { Scenario } from '../Scenario'

describe('scenarioStatefulMatcher', function () {
  type TestConfig = BaseConfiguration

  class TestRepo extends MockInMemoryRepository<Mock> {
    public constructor() {
      super()
    }
  }

  const testConfig: TestConfig = { logLevel: 'info', mode: 'verbose' }

  describe('started state', function () {
    it('should return true when state is started', function () {
      const scenario = scenarioMatcher('test')
      const ctx = {
        configuration: testConfig,
        scenarioRepository: new ScenarioInMemoryRepository(),
        mockRepository: new TestRepo()
      } as Context<TestConfig, Mock, TestRepo>

      const mock = new Mock(
        'test-id',
        'test',
        1,
        'code',
        'desc',
        [],
        [{ valueGetter: () => undefined, matcherContext: scenario }],
        0,
        new Map<string, unknown>(),
        new Map<string, unknown>()
      )

      const matcher = scenario(ctx, mock)

      expect(matcher()).toBeTruthy()
    })
  })

  it('should return true when state is not found', function () {
    const scenario = scenarioMatcher('test', 'added')
    const ctx = {
      configuration: testConfig,
      scenarioRepository: new ScenarioInMemoryRepository(),
      mockRepository: new TestRepo()
    } as Context<TestConfig, Mock, TestRepo>

    const mock = new Mock(
      'test-id',
      'test',
      1,
      'code',
      'desc',
      [],
      [{ valueGetter: () => undefined, matcherContext: scenario }],
      0,
      new Map<string, unknown>(),
      new Map<string, unknown>()
    )

    const matcher = scenario(ctx, mock)

    expect(matcher()).toBeTruthy()
  })

  it('should added new state', function () {
    const scenarioRepository = new ScenarioInMemoryRepository()

    const started = scenarioMatcher('add', Scenario.STATE_STARTED, 'added')
    const ctx = {
      configuration: testConfig,
      scenarioRepository: scenarioRepository,
      mockRepository: new TestRepo()
    } as Context<TestConfig, Mock, TestRepo>

    const mock = new Mock(
      'test-id',
      'test',
      1,
      'code',
      'desc',
      [],
      [{ valueGetter: () => undefined, matcherContext: started }],
      0,
      new Map<string, unknown>(),
      new Map<string, unknown>()
    )

    const matcher = started(ctx, mock)

    expect(matcher()).toBeTruthy()
  })

  it('should return false when scenario state is not equal to the required state', function () {
    const scenarioRepository = new ScenarioInMemoryRepository()

    const scenario = Scenario.newScenario('test')
    scenario.updateState('dev')

    scenarioRepository.save(scenario)

    const theMatcher = scenarioMatcher('test', 'qa', 'added')

    const ctx = {
      configuration: testConfig,
      scenarioRepository: scenarioRepository,
      mockRepository: new TestRepo()
    } as Context<TestConfig, Mock, TestRepo>

    const mock = new Mock(
      'test-id',
      'test',
      1,
      'code',
      'desc',
      [],
      [{ valueGetter: () => undefined, matcherContext: theMatcher }],
      0,
      new Map<string, unknown>(),
      new Map<string, unknown>()
    )

    const matcher = theMatcher(ctx, mock)

    expect(matcher()).toBeFalsy()
  })
})
