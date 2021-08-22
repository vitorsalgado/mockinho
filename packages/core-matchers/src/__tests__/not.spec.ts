import { equalsTo } from '../equalsTo'
import { not } from '../not'

describe('Not', function () {
  it('should negate another matcher', function () {
    const expected = 'value'
    const result = not(equalsTo(expected))(expected)

    expect(result).toBeFalsy()
    expect(not(equalsTo(expected))('test')).toBeTruthy()
  })
})
