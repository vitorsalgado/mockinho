import { FindMockResult } from '../FindMockResult'
import { Mock } from '../Mock'

describe('FindMockResult', function () {
  const mock = new Mock(
    '',
    'test',
    1,
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
