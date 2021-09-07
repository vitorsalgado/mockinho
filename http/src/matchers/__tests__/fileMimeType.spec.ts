import { containing } from '@mockinho/core-matchers'
import { fileMimeType } from '../fileMimeType'

describe('fileMimeType', function () {
  it('should return false when file is undefined', function () {
    expect(fileMimeType(containing('test'))(undefined)).toBeFalsy()
    expect(fileMimeType('test')(undefined)).toBeFalsy()
  })

  it('should return true when file mime type matches', function () {
    expect(
      fileMimeType(containing('image/new-format-):'))({ mimetype: 'image/new-format-):' } as any)
    ).toBeTruthy()
    expect(fileMimeType(containing('image/jpeg'))({ mimetype: 'image/gif' } as any)).toBeFalsy()
  })
})
