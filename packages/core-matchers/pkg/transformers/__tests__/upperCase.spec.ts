import { equalsTo } from '../../equalsTo'
import { upperCase } from '../upperCase'

describe('UpperCase', function () {
  it('should lowercase value', function () {
    expect(upperCase(equalsTo('TEST', false), 'pt')('test')).toBeTruthy()
    expect(upperCase(equalsTo('test', false), 'pt')('test')).toBeFalsy()
  })
})
