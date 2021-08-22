import { equalsTo } from '@mockinho/core-matchers'
import { fieldPath } from '../fieldPath'

describe('Field Path', function () {
  it('should apply matcher on field based on provided path', function () {
    const obj = { test: { inner: { message: 'hello world' } } }
    const otherObj = { message: 'test' }
    const path = 'test.inner.message'
    const expected = 'hello world'

    const matcher = fieldPath(path, equalsTo(expected))

    expect(matcher(obj)).toBeTruthy()
    expect(matcher(otherObj)).toBeFalsy()
  })

  it('should accept path with $.', function () {
    const obj = { test: { inner: { message: 'hello world' } } }
    const otherObj = { message: 'test' }
    const path = '$.test.inner.message'
    const expected = 'hello world'

    const matcher = fieldPath(path, equalsTo(expected))

    expect(matcher(obj)).toBeTruthy()
    expect(matcher(otherObj)).toBeFalsy()
  })

  it('should return false when value is not an object', function () {
    const value = 'nice value but not object'

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(fieldPath('test.message', equalsTo('hello'))(value)).toBeFalsy()
  })
})
