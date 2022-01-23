import { matches } from '../matches.js'

describe('matches', function () {
  it('should test value based on provided regex pattern', function () {
    const regex = /test/gi
    const matcher = matches(regex)
    const value = 'test'

    expect(matcher(value)).toBeTruthy()
    expect(matcher('wrong value')).toBeFalsy()
  })
})
