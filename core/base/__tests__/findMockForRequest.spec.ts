import { findMockForRequest } from '../findMockForRequest'
import { MockInMemoryRepository } from '../MockInMemoryRepository'
import { Mock } from '../Mock'
import { ScenarioInMemoryRepository } from '../ScenarioInMemoryRepository'
import { Context } from '../Context'
import { Configuration } from '../Configuration'
import { Matcher } from '../Matcher'
import { createMatcher } from '../createMatcher'
import { scenarioMatcher } from '../scenarioMatcher'
import { MatcherContextHolder } from '../MatcherContextHolder'

describe('findMockForRequest', function () {
  const equalsTo = (expectation: string) => (value: string) => expectation === value

  class TestRepo extends MockInMemoryRepository<Mock> {
    public constructor() {
      super()
    }
  }

  type TestConfig = Configuration

  const testConfig: TestConfig = {
    logLevel: 'info',
    mode: 'verbose',
    mockProviderFactories: [],
    plugins: []
  }

  describe('when theres is a match', function () {
    const repo = new TestRepo()

    const ctx = {
      configuration: testConfig,
      scenarioRepository: new ScenarioInMemoryRepository(),
      mockRepository: repo
    } as Context<Mock, TestConfig, TestRepo>

    const mock1 = new Mock(
      'test-id-1',
      'test',
      1,
      'code',
      'desc',
      [{ valueGetter: () => 'test', matcher: equalsTo('dev') as Matcher<unknown>, weight: 1 }],
      [],
      0,
      new Map<string, unknown>(),
      new Map<string, unknown>()
    )
    const mock2 = new Mock(
      'test-id-2',
      'test',
      2,
      'code',
      'desc',
      [{ valueGetter: () => 'test', matcher: equalsTo('test') as Matcher<unknown>, weight: 1 }],
      [],
      0,
      new Map<string, unknown>(),
      new Map<string, unknown>()
    )

    repo.save(mock1)
    repo.save(mock2)

    const request = {}

    it('should match and return matched mock in the result', function () {
      const result = findMockForRequest(request, ctx)

      expect(result.hasMatch()).toBeTruthy()
      expect(result.matched()).toBeDefined()
      expect(result.matched().id).toEqual('test-id-2')
    })
  })

  describe('when theres is no match', function () {
    const repo = new TestRepo()

    const ctx = {
      configuration: testConfig,
      scenarioRepository: new ScenarioInMemoryRepository(),
      mockRepository: repo
    } as Context<Mock, TestConfig, TestRepo>

    const mock1 = new Mock(
      'test-id-1',
      'test',
      1,
      'code',
      'desc',
      [{ valueGetter: () => 'test', matcher: equalsTo('dev') as Matcher<unknown>, weight: 0 }],
      [],
      0,
      new Map<string, unknown>(),
      new Map<string, unknown>()
    )

    const equalsWithMeta = createMatcher(equalsTo('no-test'), 'no-test')

    const mock2 = new Mock(
      'test-id-2',
      'test',
      2,
      'code',
      'desc',
      [
        { valueGetter: () => 'test', matcher: equalsTo('test') as Matcher<unknown>, weight: 2 },
        { valueGetter: () => 'test', matcher: equalsWithMeta as Matcher<unknown>, weight: 0 }
      ],
      [],
      0,
      new Map<string, unknown>(),
      new Map<string, unknown>()
    )

    repo.save(mock1)
    repo.save(mock2)

    const request = {}

    it('should return result with the closest match when available', function () {
      const result = findMockForRequest(request, ctx)

      expect(result.hasMatch()).toBeFalsy()
      expect(result.closestMatch().isPresent()).toBeTruthy()
      expect(result.closestMatch().get().id).toEqual('test-id-2')
    })
  })

  describe('when no match and unable to determine a close match', function () {
    const repo = new TestRepo()

    const ctx = {
      configuration: { mode: 'trace', logLevel: 'info', plugins: [], mockProviderFactories: [] },
      scenarioRepository: new ScenarioInMemoryRepository(),
      mockRepository: repo
    } as Context<Mock, TestConfig, TestRepo>

    const mock1 = new Mock(
      'test-id-1',
      'test',
      1,
      'code',
      'desc',
      [{ valueGetter: () => 'test', matcher: equalsTo('dev') as Matcher<unknown>, weight: 0 }],
      [
        {
          valueGetter: () => undefined,
          matcherContext: scenarioMatcher('test') as MatcherContextHolder<
            Mock,
            Configuration,
            unknown
          >
        }
      ],
      0,
      new Map<string, unknown>(),
      new Map<string, unknown>()
    )
    const mock2 = new Mock(
      'test-id-2',
      'test',
      2,
      'code',
      'desc',
      [{ valueGetter: () => 'test', matcher: equalsTo('no-test') as Matcher<unknown>, weight: 0 }],
      [],
      0,
      new Map<string, unknown>(),
      new Map<string, unknown>()
    )

    repo.save(mock1)
    repo.save(mock2)

    const request = {}

    it('should return the result empty', function () {
      const result = findMockForRequest(request, ctx)

      expect(result.hasMatch()).toBeFalsy()
      expect(result.closestMatch().isPresent()).toBeFalsy()
    })
  })
})
