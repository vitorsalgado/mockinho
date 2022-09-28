import { contains } from '../contains.js'

describe('contains', function () {
  it('should return true when expectation is contained in the value', function () {
    const value = 'super test suite'
    const expectation = 'test'

    const fn = contains(expectation)

    expect(fn(value)).toBeTruthy()
    expect(fn('wrong')).toBeFalsy()
  })

  it('should verify if expectation is contained in a array', function () {
    expect(contains('test')(['test', 'dev', 'typescript'])).toBeTruthy()
    expect(contains('dev')(['test', 'typescript'])).toBeFalsy()
  })
})