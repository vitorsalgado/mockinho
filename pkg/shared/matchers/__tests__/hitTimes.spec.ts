import { hitTimes } from '../hitTimes'

describe('Hit Times', function () {
  it('should return false when hit times is greater than the limit', function () {
    const ctx = {
      stub: {
        totalHits: jest.fn().mockReturnValueOnce(3)
      }
    } as any

    const matcher = hitTimes(2)

    expect(matcher(undefined, ctx)).toBeFalsy()
    expect(ctx.stub.totalHits).toHaveBeenCalled()
  })

  it('should return true when hit times is lower than the limit', function () {
    const ctx = {
      stub: {
        totalHits: jest.fn().mockReturnValueOnce(3)
      }
    } as any

    const matcher = hitTimes(5)

    expect(matcher(undefined, ctx)).toBeTruthy()
    expect(ctx.stub.totalHits).toHaveBeenCalled()
  })
})
