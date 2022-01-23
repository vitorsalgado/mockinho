import { equalsTo } from '../../equalsTo.js'
import { toLowerCase } from '../toLowerCase.js'

describe('LowerCase', function () {
  it('should lowercase value', function () {
    expect(toLowerCase(equalsTo('test', false), 'pt')('TEST')).toBeTruthy()
    expect(toLowerCase(equalsTo('TEST', false), 'pt')('TEST')).toBeFalsy()
  })
})
