import { equalTo } from '@mockdog/matchers'
import { fileContent } from '../fileContent'

describe('fileContent', function () {
  it('should return false when file is null or undefined', function () {
    expect(fileContent(equalTo('none'))(undefined).pass).toBeFalsy()
  })

  it('should return false when file buffer content is undefined', function () {
    expect(fileContent(equalTo('Hello World'))({ buffer: undefined } as any).pass).toBeFalsy()
  })

  it('should return true when file content matches', function () {
    expect(
      fileContent(equalTo('Hello World'))({ buffer: Buffer.from('Hello World') } as any).pass,
    ).toBeTruthy()

    expect(
      fileContent('Hello World')({ buffer: Buffer.from('Hello World') } as any).pass,
    ).toBeTruthy()

    expect(
      fileContent(equalTo('Good Bye'))({ buffer: Buffer.from('Good Morning') } as any).pass,
    ).toBeFalsy()
  })
})
