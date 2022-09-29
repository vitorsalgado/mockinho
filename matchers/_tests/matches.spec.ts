import { regex } from '../regex.js'

describe('matches', function () {
  it('should test value based on provided regex pattern', function () {
    const re = /test/gi
    const matcher = regex(re)
    const value = 'test'

    expect(matcher(value).pass).toBeTruthy()
    expect(matcher('wrong value').pass).toBeFalsy()
  })
})
