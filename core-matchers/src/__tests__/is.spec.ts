import { equalsTo } from '../equalsTo'
import { is } from '../is'

describe('is', function () {
  it('should decorate another matcher retaining its original behaviour', function () {
    const expected = 'value'
    const result = is(equalsTo(expected))(expected)

    expect(result).toBeTruthy()
    expect(is(equalsTo(expected))('test')).toBeFalsy()
  })
})
