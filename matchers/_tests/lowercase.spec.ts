import { equalTo } from '../equalTo.js'
import { toLowerCase } from '../text.js'

describe('LowerCase', function () {
  it('should lowercase value', function () {
    expect(toLowerCase(equalTo('test', false), 'pt')('TEST').pass).toBeTruthy()
    expect(toLowerCase(equalTo('TEST', false), 'pt')('TEST').pass).toBeFalsy()
  })
})
