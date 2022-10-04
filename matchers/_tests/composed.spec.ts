import { toLowerCase, trim } from '../text.js'
import { equalTo } from '../equalTo.js'

describe('Composed Transformers', function () {
  it('should compose multiple transformers', function () {
    expect(trim(toLowerCase(equalTo('test')))('  TEST  ').pass).toBeTruthy()
  })
})
