import { convertBodyToJSON } from '../convertBodyToJSON'

describe('convertBodyToJSON', function () {
  it('should stringify value when it is a object', function () {
    const obj = { test: 'unit', message: 'hello' }
    const result = convertBodyToJSON(obj)

    expect(result).toEqual(JSON.stringify(obj))
  })
})
