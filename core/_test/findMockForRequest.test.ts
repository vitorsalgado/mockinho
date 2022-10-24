import { equalTo } from '@mockdog/matchers'
import { FindMockResult } from '../findMockForRequest.js'
import { findMockForRequest } from '../findMockForRequest.js'
import { Mock } from '../mock.js'
import { MockRepository } from '../mockrepository.js'

describe('find mock for request', function () {
  class TestRepo extends MockRepository<Mock> {}

  describe('when theres is a match', function () {
    const repo = new TestRepo()

    const mock1 = new Mock({
      id: 'test-id-1',
      name: 'test',
      priority: 1,
      source: 'code',
      sourceDetail: 'desc',
      matchers: [{ selector: () => 'test', matcher: equalTo('dev'), score: 1, target: '' }],
    })
    const mock2 = new Mock({
      id: 'test-id-2',
      name: 'test',
      priority: 2,
      source: 'code',
      sourceDetail: 'desc',
      matchers: [{ selector: () => 'test', matcher: equalTo('test'), score: 1, target: '' }],
    })

    repo.save(mock1)
    repo.save(mock2)

    const request = {}

    it('should match and return matched mock in the result', function () {
      const result = findMockForRequest(request, repo.findEligible())

      expect(result.hasMatch()).toBeTruthy()
      expect(result.matched()).toBeDefined()
      expect(result.matched().id).toEqual('test-id-2')
    })
  })

  describe('when theres is no match', function () {
    const repo = new TestRepo()

    const mock1 = new Mock({
      id: 'test-id-1',
      name: 'test',
      priority: 1,
      source: 'code',
      sourceDetail: 'desc',
      matchers: [{ selector: () => 'test', matcher: equalTo('dev'), score: 0, target: '' }],
    })

    const mock2 = new Mock({
      id: 'test-id-2',
      name: 'test',
      priority: 2,
      source: 'code',
      sourceDetail: 'desc',
      matchers: [
        { selector: () => 'test', matcher: equalTo('test'), score: 2, target: '' },
        { selector: () => 'test', matcher: equalTo('no-test'), score: 0, target: '' },
      ],
    })

    repo.save(mock1)
    repo.save(mock2)

    const request = {}

    it('should return result with the closest match when available', function () {
      const result = findMockForRequest(request, repo.findEligible())

      expect(result.hasMatch()).toBeFalsy()
      expect(result.closestMatch().isPresent()).toBeTruthy()
      expect(result.closestMatch().get().id).toEqual('test-id-2')
    })
  })

  describe('when no match and unable to determine a close match', function () {
    const repo = new TestRepo()

    const mock1 = new Mock({
      id: 'test-id-1',
      name: 'test',
      priority: 1,
      enabled: true,
      source: 'code',
      sourceDetail: 'desc',
      matchers: [{ selector: () => 'test', matcher: equalTo('dev'), score: 0, target: '' }],
      postActions: [],
      hits: 0,
    })
    const mock2 = new Mock({
      id: 'test-id-2',
      name: 'test',
      priority: 2,
      enabled: true,
      source: 'code',
      sourceDetail: 'desc',
      matchers: [
        {
          selector: () => 'test',
          matcher: equalTo('no-test'),
          score: 0,
          target: '',
        },
      ],
      postActions: [],
      hits: 0,
    })

    repo.save(mock1)
    repo.save(mock2)

    const request = {}

    it('should return the result empty', function () {
      const result = findMockForRequest(request, repo.findEligible())

      expect(result.hasMatch()).toBeFalsy()
      expect(result.closestMatch().isPresent()).toBeFalsy()
    })
  })
})

describe('FindMockResult', function () {
  const mock = new Mock({ id: '', name: 'test', priority: 1 })

  describe('when init a no matched', function () {
    const result = FindMockResult.mismatch([], mock)

    it('should hold the closest matched mock when provided', function () {
      expect(result.closestMatch().isPresent()).toBeTruthy()
      expect(result.hasMatch()).toBeFalsy()
      expect(() => result.matched()).toThrow()
    })
  })

  describe('when init a matched instance', function () {
    const result = FindMockResult.match([], mock)

    it('should hold the matched mock', function () {
      expect(result.closestMatch().isPresent()).toBeFalsy()
      expect(result.hasMatch()).toBeTruthy()
      expect(() => result.matched()).not.toThrow()
      expect(() => result.matched()).toBeDefined()
    })
  })
})
