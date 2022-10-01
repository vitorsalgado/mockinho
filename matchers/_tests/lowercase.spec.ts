import { equalsTo } from '../equalsTo.js'
import { toLowerCase } from '../text.js'

describe('LowerCase', function () {
  it('should lowercase value', function () {
    expect(toLowerCase(equalsTo('test', false), 'pt')('TEST').pass).toBeTruthy()
    expect(toLowerCase(equalsTo('TEST', false), 'pt')('TEST').pass).toBeFalsy()
  })
})
