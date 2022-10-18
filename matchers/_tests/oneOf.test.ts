import { oneOf } from '../oneOf.js'

describe('oneOf', function () {
  it('should match when item is contained in the given list', function () {
    const result = oneOf(['test', 'dev'])('dev')

    expect(result.pass).toBeTruthy()
  })
})
