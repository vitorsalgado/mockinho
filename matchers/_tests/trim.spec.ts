import { trim } from '../text.js'
import { equalsTo } from '../equalsTo.js'

describe('Trim', function () {
  it('should trim string value', function () {
    expect(trim(equalsTo('test'))('  test  ').pass).toBeTruthy()
    expect(trim(equalsTo('  test  '))('  test  ').pass).toBeFalsy()
  })
})
