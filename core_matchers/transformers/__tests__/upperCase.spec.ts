import { equalsTo } from '../../equalsTo'
import { toUpperCase } from '../toUpperCase'

describe('UpperCase', function () {
  it('should lowercase value', function () {
    expect(toUpperCase(equalsTo('TEST', false), 'pt')('test')).toBeTruthy()
    expect(toUpperCase(equalsTo('test', false), 'pt')('test')).toBeFalsy()
  })
})
