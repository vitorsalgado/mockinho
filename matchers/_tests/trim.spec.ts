import { trim } from '../text.js'
import { equalTo } from '../equalTo.js'

describe('Trim', function () {
  it('should trim string value', function () {
    expect(trim(equalTo('test'))('  test  ').pass).toBeTruthy()
    expect(trim(equalTo('  test  '))('  test  ').pass).toBeFalsy()
  })
})
