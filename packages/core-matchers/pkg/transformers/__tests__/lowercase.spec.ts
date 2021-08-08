import { equalsTo } from '../../equalsTo'
import { lowerCase } from '../lowerCase'

describe('LowerCase', function () {
  it('should lowercase value', function () {
    expect(lowerCase(equalsTo('test', false), 'pt')('TEST')).toBeTruthy()
    expect(lowerCase(equalsTo('TEST', false), 'pt')('TEST')).toBeFalsy()
  })
})
