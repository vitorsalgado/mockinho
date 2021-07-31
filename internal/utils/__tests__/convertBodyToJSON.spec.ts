import { Buffer } from 'buffer'
import { convertBodyToJSON } from '../convertBodyToJSON'

describe('convertBodyToJSON', function () {
  it('should stringify value when it is a object', function () {
    const obj = { test: 'unit', message: 'hello' }
    const result = convertBodyToJSON(obj)

    expect(result).toEqual(JSON.stringify(obj))
  })

  it("should return value as is when it can't be converted", function () {
    expect(convertBodyToJSON(undefined)).toBeUndefined()
    expect(convertBodyToJSON(null)).toBeNull()
    expect(convertBodyToJSON('test')).toEqual('test')
    expect(convertBodyToJSON(Buffer.from('super test string'))).toEqual(
      Buffer.from('super test string')
    )
  })
})
