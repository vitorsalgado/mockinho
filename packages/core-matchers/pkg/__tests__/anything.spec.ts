import { anything } from '../anything'
import { fakeMatcherContext } from '../testUtils'

describe('Anything', function () {
  it('should return true always', function () {
    const result = anything()(undefined, fakeMatcherContext())

    expect(result).toEqual(true)
  })
})
