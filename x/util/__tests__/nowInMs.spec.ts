import { nowInMs } from '../nowInMs'

describe('nowInMs', function () {
  it('should return current in milliseconds', function () {
    const ms = nowInMs()
    expect(ms).toBeDefined()
  })
})
