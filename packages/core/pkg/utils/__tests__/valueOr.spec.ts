import { valueOr } from '../valueOr'

describe('valueOr', function () {
  it('should return same value when it is defined', function () {
    expect(valueOr('test', 'fallback')).toEqual('test')
    expect(valueOr(10, 100)).toEqual(10)
  })

  it('should return fallback when provided value is null or defined', function () {
    expect(valueOr(undefined, 10)).toEqual(10)
    expect(valueOr(null, 'test')).toEqual('test')
  })

  it('should not consider empty as a invalid argument', function () {
    expect(valueOr('', 'fallback')).toEqual('')
    expect(valueOr(0, 500)).toEqual(0)
    expect(valueOr([], ['test'])).toEqual([])
    expect(valueOr(false, true)).toBeFalsy()
  })
})
