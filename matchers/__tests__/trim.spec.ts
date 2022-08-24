import { trim } from '../trim.js'
import { equalsTo } from '../equalsTo.js'

describe('Trim', function () {
  it('should trim string value', function () {
    expect(trim(equalsTo('test'))('  test  ')).toBeTruthy()
    expect(trim(equalsTo('  test  '))('  test  ')).toBeFalsy()
  })
})
