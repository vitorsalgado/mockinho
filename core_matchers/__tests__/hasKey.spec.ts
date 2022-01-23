import { hasKey } from '../hasKey.js'

describe('hasKey', function () {
  it('should return true when object key is present', function () {
    const obj = { test: { inner: { message: 'hello world' } } }

    const matcher = hasKey('test.inner')

    expect(matcher(obj)).toBeTruthy()
    expect(matcher({ none: 'fail' })).toBeFalsy()
  })
})
