import { containing } from '../containing'

describe('Containing', function () {
  it('should return true when expectation is contained in the value', function () {
    const value = 'super test suite'
    const expectation = 'test'

    const fn = containing(expectation)

    expect(fn(value)).toBeTruthy()
    expect(fn('wrong')).toBeFalsy()
  })

  it('should return false when value is null or undefined', function () {
    expect(containing('test')(undefined)).toBeFalsy()
    expect(containing('test')(null)).toBeFalsy()
  })

  it('should verify if expectation is contained in a array', function () {
    expect(containing('test')(['test', 'dev', 'typescript'])).toBeTruthy()
    expect(containing('dev')(['test', 'typescript'])).toBeFalsy()
  })
})
