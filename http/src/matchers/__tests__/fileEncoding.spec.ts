import { equalsTo } from '@mockinho/core-matchers'
import { fileEncoding } from '../fileEncoding'

describe('fileEncoding', function () {
  it('should return false when file is undefined', function () {
    expect(fileEncoding(equalsTo('utf8'))(undefined)).toBeFalsy()
  })

  it('should return true when file encode matches', function () {
    expect(fileEncoding(equalsTo('utf8'))({ encoding: 'utf8' } as any)).toBeTruthy()
    expect(fileEncoding('utf8')({ encoding: 'utf8' } as any)).toBeTruthy()
    expect(fileEncoding(equalsTo('utf8'))({ encoding: 'some-other-encoding' } as any)).toBeFalsy()
  })
})
