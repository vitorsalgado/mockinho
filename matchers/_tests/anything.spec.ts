import { anything } from '../anything.js'

describe('Anything', function () {
  it('should return true always', function () {
    const result = anything()('')

    expect(result.pass).toEqual(true)
  })
})
