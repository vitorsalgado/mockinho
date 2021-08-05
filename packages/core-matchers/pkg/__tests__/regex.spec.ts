import { matching } from '../regex'

describe('Regex', function () {
  it('should test value based on provided regex pattern', function () {
    const regex = /test/gi
    const matcher = matching(regex)
    const value = 'test'

    expect(matcher(value)).toBeTruthy()
    expect(matcher('wrong value')).toBeFalsy()
  })
})
