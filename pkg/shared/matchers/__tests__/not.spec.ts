import { not } from '../not'
import { equalsTo } from '../equalsTo'
import { fakeMatcherContext } from './testUtils'

describe('Not', function () {
  it('should negate another matcher', function () {
    const expected = 'value'
    const result = not(equalsTo(expected))(expected, fakeMatcherContext())

    expect(result).toBeFalsy()
    expect(not(equalsTo(expected))('test', fakeMatcherContext())).toBeTruthy()
  })
})
