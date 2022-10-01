import { equalsTo } from '@mockdog/matchers'
import { fileEncoding } from '../fileEncoding'

describe('fileEncoding', function () {
  it('should return false when file is undefined', function () {
    expect(fileEncoding(equalsTo('utf8'))(undefined).pass).toBeFalsy()
  })

  it('should return true when file encode matches', function () {
    expect(fileEncoding(equalsTo('utf8'))({ encoding: 'utf8' } as any).pass).toBeTruthy()
    expect(fileEncoding('utf8')({ encoding: 'utf8' } as any).pass).toBeTruthy()
    expect(
      fileEncoding(equalsTo('utf8'))({ encoding: 'some-other-encoding' } as any).pass,
    ).toBeFalsy()
  })
})
