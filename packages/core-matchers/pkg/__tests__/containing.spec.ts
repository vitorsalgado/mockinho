import { containing } from '../containing'
import { fakeMatcherContext } from '../testUtils'

describe('Containing', function () {
  it('should return true when expectation is contained in the value', function () {
    const value = 'super test suite'
    const expectation = 'test'

    const fn = containing(expectation)

    expect(fn(value, fakeMatcherContext())).toBeTruthy()
    expect(fn('wrong', fakeMatcherContext())).toBeFalsy()
  })

  it('should return false when value is null or undefined', function () {
    expect(containing('test')(undefined, fakeMatcherContext())).toBeFalsy()
    expect(containing('test')(null, fakeMatcherContext())).toBeFalsy()
  })

  it('should verify if expectation is contained in a array', function () {
    expect(containing('test')(['test', 'dev', 'typescript'], fakeMatcherContext())).toBeTruthy()
    expect(containing('dev')(['test', 'typescript'], fakeMatcherContext())).toBeFalsy()
  })
})
