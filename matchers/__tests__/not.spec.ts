import { noop } from '../_test.js'
import { equalsTo } from '../equalsTo.js'
import { not } from '../not.js'

describe('Not', function () {
  it('should negate another matcher', function () {
    const expected = 'value'
    const result = not(equalsTo(expected))(expected, noop())

    expect(result).toBeFalsy()
    expect(not(equalsTo(expected))('test', noop())).toBeTruthy()
  })
})
