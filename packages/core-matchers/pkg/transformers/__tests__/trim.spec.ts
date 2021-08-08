import { trim } from '../trim'
import { equalsTo } from '../../equalsTo'

describe('Trim', function () {
  it('should trim string value', function () {
    expect(trim(equalsTo('test'))('  test  ')).toBeTruthy()
    expect(trim(equalsTo('  test  '))('  test  ')).toBeFalsy()
  })
})
