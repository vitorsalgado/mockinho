import { noop } from '../_test.js'
import { equalsTo } from '../equalsTo.js'
import { toUpperCase } from '../toUpperCase.js'

describe('UpperCase', function () {
  it('should lowercase value', function () {
    expect(toUpperCase(equalsTo('TEST', false), 'pt')('test', noop())).toBeTruthy()
    expect(toUpperCase(equalsTo('test', false), 'pt')('test', noop())).toBeFalsy()
  })
})
