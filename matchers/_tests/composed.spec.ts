import { toLowerCase, trim } from '../text.js'
import { equalsTo } from '../equalsTo.js'

describe('Composed Transformers', function () {
  it('should compose multiple transformers', function () {
    expect(trim(toLowerCase(equalsTo('test')))('  TEST  ').pass).toBeTruthy()
  })
})
