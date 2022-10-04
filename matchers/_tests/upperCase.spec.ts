import { equalTo } from '../equalTo.js'
import { toUpperCase } from '../text.js'

describe('UpperCase', function () {
  it('should lowercase value', function () {
    expect(toUpperCase(equalTo('TEST', false), 'pt')('test').pass).toBeTruthy()
    expect(toUpperCase(equalTo('test', false), 'pt')('test').pass).toBeFalsy()
  })
})
