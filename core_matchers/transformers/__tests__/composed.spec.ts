import { toLowerCase } from '../toLowerCase.js'
import { equalsTo } from '../../equalsTo.js'
import { trim } from '../trim.js'

describe('Composed Transformers', function () {
  it('should compose multiple transformers', function () {
    expect(trim(toLowerCase(equalsTo('test')))('  TEST  ')).toBeTruthy()
  })
})
