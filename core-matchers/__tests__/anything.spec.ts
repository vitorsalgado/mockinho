import { anything } from '../anything'

describe('Anything', function () {
  it('should return true always', function () {
    const result = anything()()

    expect(result).toEqual(true)
  })
})
