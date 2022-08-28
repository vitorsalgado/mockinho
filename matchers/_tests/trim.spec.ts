import { noop } from '../_test.js'
import { trim } from '../trim.js'
import { equalsTo } from '../equalsTo.js'

describe('Trim', function () {
  it('should trim string value', function () {
    expect(trim(equalsTo('test'))('  test  ', noop())).toBeTruthy()
    expect(trim(equalsTo('  test  '))('  test  ', noop())).toBeFalsy()
  })
})
