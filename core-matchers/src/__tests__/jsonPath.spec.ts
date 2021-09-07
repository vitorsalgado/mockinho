import { equalsTo } from '../equalsTo'
import { jsonPath } from '../jsonPath'

describe('Json Path', function () {
  it('should apply matcher on json field based on provided path', function () {
    const obj = { test: { inner: { message: 'hello world' } } }
    const otherObj = { message: 'test' }
    const path = 'test.inner.message'
    const expected = 'hello world'

    const matcher = jsonPath(path, equalsTo(expected))

    expect(matcher(obj)).toBeTruthy()
    expect(matcher(otherObj)).toBeFalsy()
  })

  it('should accept path with $.', function () {
    const obj = { test: { inner: { message: 'hello world' } } }
    const otherObj = { message: 'test' }
    const path = '$.test.inner.message'
    const expected = 'hello world'

    const matcher = jsonPath(path, equalsTo(expected))

    expect(matcher(obj)).toBeTruthy()
    expect(matcher(otherObj)).toBeFalsy()
  })

  it('should return false when value is not an object', function () {
    const value = 'nice value but not object'

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(jsonPath('test.message', equalsTo('hello'))(value)).toBeFalsy()
  })
})
