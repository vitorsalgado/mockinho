import { onRecord } from '../builtin/onRecord.js'

describe('onRecord', function () {
  it('should log record events', function () {
    onRecord({ mock: 'some-random-path.json', mockBody: 'another-path.bin' })
    onRecord({ mock: 'some-random-path.json' })
  })
})
