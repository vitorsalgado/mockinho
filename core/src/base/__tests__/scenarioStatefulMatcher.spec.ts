import { scenarioStatefulMatcher } from '../scenarioStatefulMatcher'
import { Context } from '../Context'
import { BaseConfiguration } from '../BaseConfiguration'
import { MockInMemoryRepository } from '../MockInMemoryRepository'
import { Mock } from '../Mock'
import { ScenarioInMemoryRepository } from '../ScenarioInMemoryRepository'
import { Scenario } from '../Scenario'

describe('scenarioStatefulMatcher', function () {
  class TestConfig extends BaseConfiguration {
    public constructor() {
      super('info', 'verbose')
    }
  }

  class TestRepo extends MockInMemoryRepository<Mock> {
    public constructor() {
      super()
    }
  }

  describe('started state', function () {
    it('should return true when state is started', function () {
      const scenario = scenarioStatefulMatcher('test')
      const ctx = {
        configuration: new TestConfig(),
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
        [{ valueGetter: () => undefined, matcher: scenario }],
        0,
        new Map<string, unknown>(),
        new Map<string, unknown>()
      )

      const matcher = scenario(ctx, mock)

      expect(matcher()).toBeTruthy()
    })
  })

  it('should return true when state is not found', function () {
    const scenario = scenarioStatefulMatcher('test', 'added')
    const ctx = {
      configuration: new TestConfig(),
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
      [{ valueGetter: () => undefined, matcher: scenario }],
      0,
      new Map<string, unknown>(),
      new Map<string, unknown>()
    )

    const matcher = scenario(ctx, mock)

    expect(matcher()).toBeTruthy()
  })

  it('should added new state', function () {
    const scenarioRepository = new ScenarioInMemoryRepository()

    const started = scenarioStatefulMatcher('add', Scenario.STATE_STARTED, 'added')
    const ctx = {
      configuration: new TestConfig(),
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
      [{ valueGetter: () => undefined, matcher: started }],
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

    const theMatcher = scenarioStatefulMatcher('test', 'qa', 'added')

    const ctx = {
      configuration: new TestConfig(),
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
      [{ valueGetter: () => undefined, matcher: theMatcher }],
      0,
      new Map<string, unknown>(),
      new Map<string, unknown>()
    )

    const matcher = theMatcher(ctx, mock)

    expect(matcher()).toBeFalsy()
  })
})
