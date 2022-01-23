import { not } from '..'

describe('isTrue', function () {
  it('should not throw error when condition is met', function () {
    const value = 'test'

    expect(() => not(value === 'test')).not.toThrowError()
    expect(() => not(10 > 1000)).toThrowError()
  })
})
