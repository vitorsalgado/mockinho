import { lowerCase } from '../lowerCase'
import { equalsTo } from '../../equalsTo'
import { trim } from '../trim'

describe('Composed Transformers', function () {
  it('should compose multiple transformers', function () {
    expect(trim(lowerCase(equalsTo('test')))('  TEST  ')).toBeTruthy()
  })
})
