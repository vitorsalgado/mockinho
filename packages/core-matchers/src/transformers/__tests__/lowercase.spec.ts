import { equalsTo } from '../../equalsTo'
import { toLowerCase } from '../toLowerCase'

describe('LowerCase', function () {
  it('should lowercase value', function () {
    expect(toLowerCase(equalsTo('test', false), 'pt')('TEST')).toBeTruthy()
    expect(toLowerCase(equalsTo('TEST', false), 'pt')('TEST')).toBeFalsy()
  })
})
