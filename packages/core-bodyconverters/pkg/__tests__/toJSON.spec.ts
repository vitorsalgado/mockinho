import { toJSON } from '../toJSON'

describe('toJSON', function () {
  it('should convert object to JSON', function () {
    const obj = { name: 'test' }
    const result = toJSON(obj)

    expect(result).toEqual('{"name":"test"}')
  })
})
