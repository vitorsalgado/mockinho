import { equalsTo, fakeContext } from '@mockinho/core-matchers'
import { fileContent } from '../fileContent'

describe('fileContent', function () {
  it('should return false when file is null or undefined', function () {
    expect(fileContent(equalsTo('none'))(undefined, fakeContext())).toBeFalsy()
  })

  it('should return false when file buffer content is undefined', function () {
    expect(
      fileContent(equalsTo('Hello World'))({ buffer: undefined } as any, fakeContext())
    ).toBeFalsy()
  })

  it('should return true when file content matches', function () {
    expect(
      fileContent(equalsTo('Hello World'))(
        { buffer: Buffer.from('Hello World') } as any,
        fakeContext()
      )
    ).toBeTruthy()

    expect(
      fileContent(equalsTo('Good Bye'))(
        { buffer: Buffer.from('Good Morning') } as any,
        fakeContext()
      )
    ).toBeFalsy()
  })
})
