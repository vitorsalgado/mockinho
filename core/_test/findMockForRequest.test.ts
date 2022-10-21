import { equalTo } from '@mockdog/matchers'
import { FindMockResult } from '../findMockForRequest.js'
import { findMockForRequest } from '../findMockForRequest.js'
import { Mock } from '../mock.js'
import { MockRepository } from '../mockrepository.js'

describe('findMockForRequest', function () {
  class TestRepo extends MockRepository<Mock> {
    public constructor() {
      super()
    }
  }

  describe('when theres is a match', function () {
    const repo = new TestRepo()

    const mock1 = new Mock(
      'test-id-1',
      'test',
      1,
      true,
      'code',
      'desc',
      [{ selector: () => 'test', matcher: equalTo('dev'), score: 1, target: '' }],
      [],
      0,
    )
    const mock2 = new Mock(
      'test-id-2',
      'test',
      2,
      true,
      'code',
      'desc',
      [{ selector: () => 'test', matcher: equalTo('test'), score: 1, target: '' }],
      [],
      0,
    )

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

    const mock1 = new Mock(
      'test-id-1',
      'test',
      1,
      true,
      'code',
      'desc',
      [{ selector: () => 'test', matcher: equalTo('dev'), score: 0, target: '' }],
      [],
      0,
    )

    const mock2 = new Mock(
      'test-id-2',
      'test',
      2,
      true,
      'code',
      'desc',
      [
        { selector: () => 'test', matcher: equalTo('test'), score: 2, target: '' },
        { selector: () => 'test', matcher: equalTo('no-test'), score: 0, target: '' },
      ],
      [],
      0,
    )

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

    const mock1 = new Mock(
      'test-id-1',
      'test',
      1,
      true,
      'code',
      'desc',
      [{ selector: () => 'test', matcher: equalTo('dev'), score: 0, target: '' }],
      [],
      0,
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
          matcher: equalTo('no-test'),
          score: 0,
          target: '',
        },
      ],
      [],
      0,
    )

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
  const mock = new Mock('', 'test', 1, true, 'code', 'desc', [], [], 0)

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
