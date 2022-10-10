import { contains } from '@mockdog/matchers'
import { fileMimeType } from '../fileMimeType'

describe('fileMimeType', function () {
  it('should return false when file is undefined', function () {
    expect(fileMimeType(contains('test'))(undefined).pass).toBeFalsy()
    expect(fileMimeType('test')(undefined).pass).toBeFalsy()
  })

  it('should return true when file mime type matches', function () {
    expect(
      fileMimeType(contains('image/new-format-):'))({ mimetype: 'image/new-format-):' } as any)
        .pass,
    ).toBeTruthy()
    expect(fileMimeType(contains('image/jpeg'))({ mimetype: 'image/gif' } as any).pass).toBeFalsy()
  })
})
