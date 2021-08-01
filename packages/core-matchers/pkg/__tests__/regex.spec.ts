import { matching } from '../regex'
import { fakeMatcherContext } from '../testUtils'

describe('Regex', function () {
  it('should test value based on provided regex pattern', function () {
    const regex = /test/gi
    const matcher = matching(regex)
    const value = 'test'

    expect(matcher(value, fakeMatcherContext())).toBeTruthy()
    expect(matcher('wrong value', fakeMatcherContext())).toBeFalsy()
  })
})
