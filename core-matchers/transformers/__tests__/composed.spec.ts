import { toLowerCase } from '../toLowerCase'
import { equalsTo } from '../../equalsTo'
import { trim } from '../trim'

describe('Composed Transformers', function () {
  it('should compose multiple transformers', function () {
    expect(trim(toLowerCase(equalsTo('test')))('  TEST  ')).toBeTruthy()
  })
})
