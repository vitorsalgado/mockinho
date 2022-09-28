import { FindMockResult } from './findMockForRequest.js'
import { findMockForRequest } from './findMockForRequest.js'
import { Mock } from './mock.js'
import { MockInMemoryRepository } from './mockrepository.js'
import { ScenarioRepository } from './scenario.js'
import { Context } from './context.js'
import { Configuration } from './configuration.js'

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
    plugins: [],
  }

  describe('when theres is a match', function () {
    const repo = new TestRepo()

    const ctx = {
      configuration: testConfig,
      scenarioRepository: new ScenarioRepository(),
      mockRepository: repo,
    } as Context<Mock, TestConfig, TestRepo>

    const mock1 = new Mock(
      'test-id-1',
      'test',
      1,
      true,
      'code',
      'desc',
      [{ selector: () => 'test', matcher: equalsTo('dev'), score: 1, target: '' }],
      [],
      0,
      new Map<string, unknown>(),
      new Map<string, unknown>(),
    )
    const mock2 = new Mock(
      'test-id-2',
      'test',
      2,
      true,
      'code',
      'desc',
      [{ selector: () => 'test', matcher: equalsTo('test'), score: 1, target: '' }],
      [],
      0,
      new Map<string, unknown>(),
      new Map<string, unknown>(),
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
      scenarioRepository: new ScenarioRepository(),
      mockRepository: repo,
    } as Context<Mock, TestConfig, TestRepo>

    const mock1 = new Mock(
      'test-id-1',
      'test',
      1,
      true,
      'code',
      'desc',
      [{ selector: () => 'test', matcher: equalsTo('dev'), score: 0, target: '' }],
      [],
      0,
      new Map<string, unknown>(),
      new Map<string, unknown>(),
    )

    const mock2 = new Mock(
      'test-id-2',
      'test',
      2,
      true,
      'code',
      'desc',
      [
        { selector: () => 'test', matcher: equalsTo('test'), score: 2, target: '' },
        { selector: () => 'test', matcher: equalsTo('no-test'), score: 0, target: '' },
      ],
      [],
      0,
      new Map<string, unknown>(),
      new Map<string, unknown>(),
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
      scenarioRepository: new ScenarioRepository(),
      mockRepository: repo,
    } as Context<Mock, TestConfig, TestRepo>

    const mock1 = new Mock(
      'test-id-1',
      'test',
      1,
      true,
      'code',
      'desc',
      [{ selector: () => 'test', matcher: equalsTo('dev'), score: 0, target: '' }],
      [],
      0,
      new Map<string, unknown>(),
      new Map<string, unknown>(),
    )
    const mock2 = new Mock(
      'test-id-2',
      'test',
      2,
      true,
      'code',
      'desc',
      [
        {
          selector: () => 'test',
          matcher: equalsTo('no-test'),
          score: 0,
          target: '',
        },
      ],
      [],
      0,
      new Map(),
      new Map<string, unknown>(),
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

describe('FindMockResult', function () {
  const mock = new Mock(
    '',
    'test',
    1,
    true,
    'code',
    'desc',
    [],
    [],
    0,
    new Map<string, unknown>(),
    new Map<string, unknown>(),
  )

  describe('when init a no matched', function () {
    const result = FindMockResult.noMatch(mock)

    it('should hold the closest matched mock when provided', function () {
      expect(result.closestMatch().isPresent()).toBeTruthy()
      expect(result.hasMatch()).toBeFalsy()
      expect(() => result.matched()).toThrow()
    })
  })

  describe('when init a matched instance', function () {
    const result = FindMockResult.match(mock)

    it('should hold the matched mock', function () {
      expect(result.closestMatch().isPresent()).toBeFalsy()
      expect(result.hasMatch()).toBeTruthy()
      expect(() => result.matched()).not.toThrow()
      expect(() => result.matched()).toBeDefined()
    })
  })

  it('should throw error when attempting to init a matched result without the match mock', function () {
    expect(() => FindMockResult.match(null as any)).toThrow()
  })
})
