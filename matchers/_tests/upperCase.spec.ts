import { equalsTo } from '../equalsTo.js'
import { toUpperCase } from '../text.js'

describe('UpperCase', function () {
  it('should lowercase value', function () {
    expect(toUpperCase(equalsTo('TEST', false), 'pt')('test').pass).toBeTruthy()
    expect(toUpperCase(equalsTo('test', false), 'pt')('test').pass).toBeFalsy()
  })
})
